# Sharework Developer Test

This test aims at getting an idea about how candidates fit Sharework's standards in terms of software development.

At Sharework, we do not expect you to master everything we do or use - we are looking for people that will understand what we want to do and will have good ideas about how to do it, so please use whatever you want to show us your skills!

## Context

Sharework develops a solution that aims at finding companies present in multiple CRMs, to build a bunch of different features for our customers.
Here are the main definitions of the keywords we use:

- B2B: Business to Business, e.g. companies whose product or service targets other companies (as opposed to B2C or C2C, where C stands for individual customer)
- CRM: Customer Relationship Management, a tool used by companies to manage the lifecycle of their targets & customer
- Prospect: a company that is in a CRM but not yet a customer
- Customer: a company that has already purchased / subscribed to a product or service
- Match: a pair of CRM records representing a company, that are representing similar entities. It could be an exact match (representing exactly the same company), or a close match (entities of the same group for instance)

The goal of this test is to give you the opportunity to show us where in our stack you would feel most comfortable, we do not expect our candidates to shine in all areas but you should be able to contribute to a least one of the major areas.

## General instructions

### Getting started

Clone this repository on your local machine.

### Expectations

Unless told otherwise, pick the sections of the test that you feel most comfortable with. Our goal is to see how you shine in your area of expertise, not what you do not know.

We do not expect you to work on all tests, although it is always a plus to do as much as possible. But please, do not spend night and days on the test, this is really not the goal.

### Deliver your results

Each test has its own directory in the repository. This is where everything you write for your test should be located.

Once you have finished working on the tests, please compress the whole repository and send it to us.

## Matching

In the matching/ folder, you will find 2 datasets of companies and some of their attributes.
They represent the data available in the CRMs of 2 of our users.

### Mission

Your goals are:

1. Write an algorithm that will use the data from the "companies" table and compute matches based on the company attributes

   - only compute matches between companies from different sources
   - you can use any attribute, but in general name only is not good enough
   - unless you want to implement the following step, you can output the result in the form of a CSV file with the columns of your choice
     - make sure we can identify in the match exactly what records are involved
     - you can include extra data, such as a score, or reasons that explain the match etc...

2. (optional) Use a sqlite database
   - Write a connector that ingests the CSV files and store the data in a SQlite database
     - all the data should be loaded in a table named "companies"
     - this table should include a "source_id" column and a "source_name" column, that will store the ID in the source CSV and the name for the source file
   - Store the results of the matching algorithm in "matches" table

### Evaluation

The following criteria will be used to evaluate the code you write:

- Precision: percentage of identified matches that are correct matches
- Recall: percentage of actual matches that are listed in your results
- Performance: how fast is your implementation?
- Code modularity and readability

Bonus points:

- Include unit tests
- Implement Step 2

### Tips

We do not expect you to use all possible ways to identify matches, but rather to show us what good ideas you have to find as many matches as possible.

If you choose to implement Step 2, we highly recommend the use of an ORM to maniplate the data (such as Django ORM, Rails Active Record), but this is not required. But if you implement something without an ORM, take into account security best practices in the area of databases.

## Backend Web

Sharework exposes data to users only through RESTful APIs. This exercise aims at giving you an opportunity to show us how comfortable you are with the concept related to backend web development and RESTful API standards.

We prepared data that corresponds to the output of the "Matching" section, in the form of a file named backend_base.sqlite3.
It contains:

- a "companies" table, containing many records of company and their attributes
- a "matches" table, containing a sample of matches computed by Sharework

### Mission

Implement and API on top of this database that allows the following operations:

- list companies
- access a single company
- list matching companies for a given company
- (optional) mark a match as "invalid"

You can modify the schema if you need to.

The technology you use is up to you, simply implement something you are comfortable with.

Defining the output format is completely up to you, XML, JSON, or whatever you think is suitable for this use case.

### Evaluation

We will look at the following points with attention:

- Follow the REST principles
- Make sure the response format is easily readable
- Keep performance in mind: we should be able to expose data very quickly to users to keep our app reactive

Bonus points:

- Unit Testing
- API Testing

## Frontend Web

We use React and Redux for our front end application.
We included a basic React app in the "frontend_web" directory (using create-react-app) and we also added Redux and React-Redux to the dependencies. We also added React-Router.

### Getting Started

Go into the frontend_web directory and run install the app by running:

```bash
yarn install
```

You should then be able to start the server with the command:

```bash
yarn start
```

If you plan on implementing tests, simply run:

```bash
yarn test
```

To load data in the app, you can use the following URLs:

- http://localhost:3000/api/companies-{page}.json
- http://localhost:3000/api/companies/{id}.json

### Mission

1. Make sure that the home page displays a list of companies
   - Use the JSON API as explained in "Getting Started"
   - Table rows should show the company's name and ID
   - Pick the strategy you want to deal with API pagination, but display almost 9000 lines in a page is not a good idea
2. Provide a way to navigate from a row in the list of companies, to a page showing a specific company's details
   - Use the JSON API to get company details from the ID
   - Show as many details as possible
3. Provide a mechanism to hide a company from the list
4. Provide a mechanism to hide a company from the company details page

### Evaluation

The UX is what matters most: the users should understand what the see, and how to interact with the app.
Additionally, we will look the code clarity, modularity and maintainability.

Bonus points:

- implement some tests using jest
- make the actions persistent (when the page is refreshed, the hidden companies remain hidden)
