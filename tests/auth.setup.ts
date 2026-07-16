import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ request }) => {
  const res = await request.post('http://localhost:5173/api/v1/auth/dev-login', {
    data: { email: 'asrulazwan90@gmail.com' },
  });
  const body = await res.json();

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify({
    cookies: [],
    origins: [{
      origin: 'http://localhost:5173',
      localStorage: [
        { name: 'berry_jwt', value: body.data.token },
        { name: 'berry_user', value: JSON.stringify({ name: 'Admin', email: 'asrulazwan90@gmail.com', role: 'ADMIN' }) },
      ],
    }],
  }));
});
