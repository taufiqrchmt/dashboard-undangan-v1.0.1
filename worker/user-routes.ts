import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from './core-utils';
import { ProfileEntity, EventSettingEntity, MessageTemplateEntity, GuestGroupEntity, GuestEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { Guest, GuestGroup, MessageTemplate } from "@shared/types";
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
    const profileEntity = new ProfileEntity(c.env, effectiveEmail);
    if (!(await profileEntity.exists())) {
      return notFound(c, 'Invalid credentials');
    }
    const profile = await profileEntity.getState();
    if (profile.role === 'admin' && password !== '#m4rjinaL') {
      return bad(c, 'Invalid credentials');
    }
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
  const templateCreateSchema = z.object({
    name: z.string().min(1),
    content_wa: z.string(),
    content_copy: z.string(),
    is_default: z.boolean().optional(),
  });
  app.post('/api/users/:userId/templates', zValidator('json', templateCreateSchema), async (c) => {
    const userId = c.req.param('userId');
    const body = c.req.valid('json');
    const newTemplate: MessageTemplate = {
      id: crypto.randomUUID(),
      owner_user_id: userId,
      scope: 'user',
      name: body.name,
      content_wa: body.content_wa,
      content_copy: body.content_copy,
      is_default: body.is_default ?? false,
      created_at: new Date().toISOString(),
    };
    await MessageTemplateEntity.create(c.env, newTemplate);
    return ok(c, newTemplate);
  });
  app.put('/api/users/:userId/templates/:templateId', zValidator('json', templateCreateSchema), async (c) => {
    const { userId, templateId } = c.req.param();
    const body = c.req.valid('json');
    const entity = new MessageTemplateEntity(c.env, templateId);
    if (!(await entity.exists())) return notFound(c, 'Template not found');
    const current = await entity.getState();
    if (current.owner_user_id !== userId || current.scope !== 'user') return bad(c, 'Permission denied');
    const updatedTemplate: MessageTemplate = {
      ...current,
      name: body.name,
      content_wa: body.content_wa,
      content_copy: body.content_copy,
      is_default: body.is_default ?? current.is_default,
    };
    await entity.save(updatedTemplate);
    return ok(c, updatedTemplate);
  });
  app.delete('/api/users/:userId/templates/:templateId', async (c) => {
    const { userId, templateId } = c.req.param();
    const entity = new MessageTemplateEntity(c.env, templateId);
    if (!(await entity.exists())) return notFound(c, 'Template not found');
    const current = await entity.getState();
    if (current.owner_user_id !== userId || current.scope !== 'user') return bad(c, 'Permission denied');
    await MessageTemplateEntity.delete(c.env, templateId);
    return ok(c, { id: templateId });
  });
  // GUEST GROUPS (for a specific user)
  app.get('/api/users/:userId/groups', async (c) => {
    const userId = c.req.param('userId');
    const { items } = await GuestGroupEntity.list(c.env);
    const userGroups = items.filter(g => g.user_id === userId).sort((a, b) => a.sort_order - b.sort_order);
    return ok(c, userGroups);
  });
  const groupSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    sort_order: z.number().optional(),
  });
  app.post('/api/users/:userId/groups', zValidator('json', groupSchema), async (c) => {
    const userId = c.req.param('userId');
    const body = c.req.valid('json');
    const newGroup: GuestGroup = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: body.name,
      description: body.description ?? null,
      sort_order: body.sort_order ?? 0,
      created_at: new Date().toISOString(),
    };
    await GuestGroupEntity.create(c.env, newGroup);
    return ok(c, newGroup);
  });
  app.put('/api/users/:userId/groups/:groupId', zValidator('json', groupSchema), async (c) => {
    const { userId, groupId } = c.req.param();
    const body = c.req.valid('json');
    const entity = new GuestGroupEntity(c.env, groupId);
    if (!(await entity.exists())) return notFound(c, 'Group not found');
    const current = await entity.getState();
    if (current.user_id !== userId) return bad(c, 'Permission denied');
    const updatedGroup: GuestGroup = {
      ...current,
      name: body.name,
      description: body.description ?? current.description,
      sort_order: body.sort_order ?? current.sort_order,
    };
    await entity.save(updatedGroup);
    return ok(c, updatedGroup);
  });
  app.delete('/api/users/:userId/groups/:groupId', async (c) => {
    const { userId, groupId } = c.req.param();
    const entity = new GuestGroupEntity(c.env, groupId);
    if (!(await entity.exists())) return notFound(c, 'Group not found');
    const current = await entity.getState();
    if (current.user_id !== userId) return bad(c, 'Permission denied');
    // TODO: Handle guests in this group. For now, we just delete the group.
    await GuestGroupEntity.delete(c.env, groupId);
    return ok(c, { id: groupId });
  });
  // GUESTS (for a specific user)
  app.get('/api/users/:userId/guests', async (c) => {
    const userId = c.req.param('userId');
    const { items } = await GuestEntity.list(c.env);
    const userGuests = items.filter(g => g.user_id === userId);
    return ok(c, userGuests);
  });
  const guestSchema = z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    group_id: z.string().optional(),
    notes: z.string().optional(),
  });
  app.post('/api/users/:userId/guests', zValidator('json', guestSchema), async (c) => {
    const userId = c.req.param('userId');
    const body = c.req.valid('json');
    const newGuest: Guest = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: body.name,
      phone: body.phone ?? null,
      group_id: body.group_id ?? null,
      notes: body.notes ?? null,
      is_sent: false,
      last_sent_at: null,
      created_at: new Date().toISOString(),
    };
    await GuestEntity.create(c.env, newGuest);
    return ok(c, newGuest);
  });
  app.put('/api/users/:userId/guests/:guestId', zValidator('json', guestSchema), async (c) => {
    const { userId, guestId } = c.req.param();
    const body = c.req.valid('json');
    const entity = new GuestEntity(c.env, guestId);
    if (!(await entity.exists())) return notFound(c, 'Guest not found');
    const current = await entity.getState();
    if (current.user_id !== userId) return bad(c, 'Permission denied');
    const updatedGuest: Guest = {
      ...current,
      name: body.name,
      phone: body.phone ?? current.phone,
      group_id: body.group_id ?? current.group_id,
      notes: body.notes ?? current.notes,
    };
    await entity.save(updatedGuest);
    return ok(c, updatedGuest);
  });
  app.delete('/api/users/:userId/guests/:guestId', async (c) => {
    const { userId, guestId } = c.req.param();
    const entity = new GuestEntity(c.env, guestId);
    if (!(await entity.exists())) return notFound(c, 'Guest not found');
    const current = await entity.getState();
    if (current.user_id !== userId) return bad(c, 'Permission denied');
    await GuestEntity.delete(c.env, guestId);
    return ok(c, { id: guestId });
  });
}