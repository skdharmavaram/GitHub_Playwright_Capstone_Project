import {request, expect} from '@playwright/test';

export async function createRepo(token, repoName) {
    const context = await request.newContext({
        baseURL: 'https://api.github.com',
        extraHTTPHeaders: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json'
        }
    });

    const response = await context.post('/user/repos', {
        data: {
            name: repoName,
            private: false,
            description: 'Repo created via Playwright API Automation'
        }
    });
    console.log("Repository created:", repoName);
    console.log("status code:", response.status());
    console.log("Response body:", await response.json());

    expect(response.status()).toBe(201);

    return await response.json();
}

export async function deleteRepo(token, owner, repoName) {
    const context = await request.newContext({
        baseURL: 'https://api.github.com',
        extraHTTPHeaders: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json'
        }
    });

    const response = await context.delete(`/repos/${owner}/${repoName}`);
    expect (response.status()).toBe(204);
    console.log("Repository deleted:", repoName);
    console.log("status code:", response.status());
}