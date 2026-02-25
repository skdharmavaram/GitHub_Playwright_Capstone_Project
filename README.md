The Challenges which I encountered while implementing this test automation script is
1. Identifying the locators of realtime website
2. In Login Page- 
    1) While encorpotating it in test page, it was observed that, for every test, we need to call the login and do the execution. So based on previous learnings, I used two methods like test.beforeAll and test.afterAll to include login functionality and logout one.
    2) Observation: While after login for the first time, github is asking for the two factor authentication. I tried to automate this process too, but taking more time where I'm lagging beyond on other scenarios. Hence till whatever I written the code, i kept a side, and which is not breaking my exsisting code, and I further continued. Will try to work on this later on. 
    3) Performed validation like checking dashboard is visible or not.
    4) Once this specific test is completed, I saaved the success screenshot with respective name along with ${Date.now()} method for uniqueness.
    5) I have read the userId, and password from .env file where I have stored it for security purpose and added this file into .gitignore file to ignore it while pushing the code to gitHub. 

3. Create homePage.js for basic validation whether user is in repositories page or not.

4. Created RepoPage.js to maintain and access the locators and methos related to repositories pabge. Here -
    1. I included the process to navigate to the new reo page
    2. Validated whether mentioned repo is available or not.

5. Created NewRepo.js page to create a repository
    1. Here I encountered dropdown issue - because of visibilityDropdown.click() method. hence manually I trigged the scenario again to identify step by step process. After that I understood the flow, hence implemented seperate methods for each actions so that I can call them in my test file by including waitForTimeout method for visibility of the flow in test execution.
