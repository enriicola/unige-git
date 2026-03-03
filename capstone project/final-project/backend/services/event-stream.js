import { v4 as uuidv4 } from 'uuid';

const clients = new Map();

const formatEvent = (event, data) => {
  const payload = typeof data === 'string' ? data : JSON.stringify(data ?? {});
  return `event: ${event}\ndata: ${payload}\n\n`;
};

const writeEvent = (res, event, data) => {
  res.write(formatEvent(event, data));
};

export const registerEventClient = ({ res, user }) => {
  const id = uuidv4();
  clients.set(id, { res, user });
  return id;
};

export const removeEventClient = (id) => {
  clients.delete(id);
};

export const sendEvent = ({ res, event, data }) => {
  if (!res) return;
  writeEvent(res, event, data);
};

export const broadcastEvent = ({ event, data, filter }) => {
  for (const [id, client] of clients.entries()) {
    if (typeof filter === 'function' && !filter(client)) continue;
    try {
      writeEvent(client.res, event, data);
    } catch {
      clients.delete(id);
    }
  }
};
