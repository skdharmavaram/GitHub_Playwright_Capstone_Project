export function createRepoPayload() {
  return {
    name: `playwright-ui-test-${Date.now()}`,
    description: 'Repo created via Playwright UI Automation Test',
    private: false,
    owner: process.env.GITHUB_USER
  };
}
