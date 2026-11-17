# Github: #

Repo: https://github.com/ronaldvanderlouw/playwright-githubactions

Trigger: 
```YAML
    on:
    push:
        branches: [ main, master ]
    pull_request:
        branches: [ main, master ]
```
This defines when your tests run. Every time you push code to the main or master branch, or when a pull request is created targeting those branches, the tests will be triggered automatically.

Job steps:
```YAML
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 7
```
The workflow runs on ubuntu-latest and executes these steps in order:
    1. Check out the code from your repository
    2. Set up Node.js (LTS version)      
    3. Install project dependencies with npm ci
    4. Install Playwright browsers with npx playwright install --with-deps
    5. Run your tests with npx playwright test
    6. Upload the report as a build artifact