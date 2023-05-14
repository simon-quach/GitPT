## Inspiration
GPT4 can store entire codebases in its 32k context, but each time you ask it a question you will use almost 2$ per query. That means 10 queries would be almost $20, which is unsustainable for students.

## What it does
Utilizing low context chatbots such as GPT3, we aim to help students understand codebases through natural language without spending astronomical amounts of money.

The application is designed to parse a GitHub repository link provided by the user and extract the owner and repository names from it. This is useful in a number of scenarios, such as when a developer wants to clone or fork a repository, or when a team lead wants to share a repository link with their team members.

The parsing is done by analyzing the URL structure of the GitHub link. GitHub repository links typically follow the format https://github.com/<owner>/<repository-name>. The application uses this structure to extract the owner and repository names.

Further, once the link is parsed, the application uses the extracted owner and repository names to access the OpenAI API and fetch information about the repository, including its contents. The contents of the repository are then displayed to the user, along with a description of what each file does.

For example, if the repository contains a README.md file, the application will display the contents of that file in a user-friendly format. Additionally, if the repository contains any code files, the application will display the syntax-highlighted code along with a brief description of what the code does.

This feature can be particularly useful for developers who are exploring new repositories and want to quickly understand what kind of code is contained within them. By providing a summary of the contents of the repository, the application can save developers time and help them make more informed decisions about whether to use or contribute to the repository.

## How we built it
Frontend: used Three.js, Next.js, Tailwind CSS, and TypeScript for the front-end, which includes pleasant 3D models in the responsive, interactive SSR user-interface. For the back-end, we used Node.js and Express for the server-side scripting.  We used OpenAI API to summarize all the files in GitHub repositories, and we also used MongoDB for the non-SQL database, which stores the path, summary, and original contents. We also used Milvus as our vector database.

## Challenges we ran into
One of the biggest challenges we faced during the development process was designing a user interface that was both intuitive and visually appealing. We used Three.js geometry with a typescript and Next.js folder structure using the new /app directory, and had a challenge adding the geometry layered under the navbar and integrating it with the rest of the website UI/UX.  We spent a lot of time researching different design patterns and user experience principles to ensure that our application was easy to use and navigate.

Another challenge we faced was managing the complexity of the data model and database interactions. We had to make sure that all the different components of the application, such as the search functionality and messaging system, were integrated seamlessly and efficiently.

Implementing a breadcrumb system to navigate the repository through diverse paths and creating a tree structure was a substantial challenge that took us a while to figure out.

## Accomplishments that we're proud of
We're proud of fully integrating the Three.js wireframe torus knot into the website to be animated and responsive. We are also proud of the other technical skills that we have developed during the course of this project, including front-end and back-end development and database management.

## What we learned
What we learned includes best practices for front-end design, how to use Three.js in a typescript and Next.js file structure, server-side rendering, and database management, especially with the combination of a vector database with a non-SQL database. We also learned about the importance of effective communication and collaboration, both within our team and with external stakeholders such as users and potential partners.

## What's next for GitPT
We want to officially deploy to allow students to use a zero/low-cost alternative to GPT-4's expensive queries. We'd like to promote understanding of codebases among students through outreach with this application. Moving forward, we plan to continue developing GitPT by adding new features and improving existing functionality. We want to explore ways to make the platform more accessible and user-friendly, including the possibility of developing a mobile app. We also plan to expand our user base by reaching out to more organizations and volunteers and building partnerships with other organizations in the education sector. Ultimately, our goal is to create a vibrant and dynamic community of innovation and understanding.
