import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProfileEntity, EventSettingEntity, MessageTemplateEntity, GuestGroupEntity, GuestEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { Profile } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure all seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      ProfileEntity.ensureSeed(c.env),
      EventSettingEntity.ensureSeed(c.env),
      MessageTemplateEntity.ensureSeed(c.env),
      GuestGroupEntity.ensureSeed(c.env),
      GuestEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { email, password } = await c.req.json<{ email?: string, password?: string }>();
    let effectiveEmail = email;
    if (email === 'admin') {
      effectiveEmail = 'admin@example.com';
    }
    if (!effectiveEmail) {
      return bad(c, 'Email is required');
    }
    // This is a MOCK login. In a real app, you'd verify the password hash.
    // Here, we just check if the user exists and if the password matches the mock one.
    const profileEntity = new ProfileEntity(c.env, effectiveEmail);
    if (!(await profileEntity.exists())) {
      return notFound(c, 'Invalid credentials');
    }
    const profile = await profileEntity.getState();
    if (profile.role === 'admin' && password !== '#m4rjinaL') {
      return bad(c, 'Invalid credentials');
    }
    // For regular users, we are not checking passwords in this mock setup.
    return ok(c, profile);
  });
  // PROFILES
  app.get('/api/profiles', async (c) => {
    const { items } = await ProfileEntity.list(c.env);
    return ok(c, items);
  });
  // EVENT SETTINGS (for a specific user)
  app.get('/api/users/:userId/event-settings', async (c) => {
    const userId = c.req.param('userId');
    const { items } = await EventSettingEntity.list(c.env);
    const userSettings = items.find(item => item.user_id === userId);
    if (!userSettings) {
      return notFound(c, 'Event settings not found for this user.');
    }
    return ok(c, userSettings);
  });
  // TEMPLATES (for a specific user + global)
  app.get('/api/users/:userId/templates', async (c) => {
    const userId = c.req.param('userId');
    const { items } = await MessageTemplateEntity.list(c.env);
    const userTemplates = items.filter(t => t.scope === 'global' || t.owner_user_id === userId);
    return ok(c, userTemplates);
  });
  // GUEST GROUPS (for a specific user)
  app.get('/api/users/:userId/groups', async (c) => {
    const userId = c.req.param('userId');
    const { items } = await GuestGroupEntity.list(c.env);
    const userGroups = items.filter(g => g.user_id === userId).sort((a, b) => a.sort_order - b.sort_order);
    return ok(c, userGroups);
  });
  // GUESTS (for a specific user)
  app.get('/api/users/:userId/guests', async (c) => {
    const userId = c.req.param('userId');
    const { items } = await GuestEntity.list(c.env);
    const userGuests = items.filter(g => g.user_id === userId);
    return ok(c, userGuests);
  });
}