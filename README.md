## Tournest REST API Overview

Tournest is a comprehensive REST API designed to support a web application tailored for travel and tourism, focusing on tour package management. This API facilitates a wide range of functionalities to enhance user experience and streamline operations for tour bookings. Below is an overview of the key features provided by the Tournest REST API:

- **Tour Packages Management**: The API allows for the creation, retrieval, updating, and deletion of tour package details. This includes information about destinations, itineraries, pricing, and availability.

- **User Authentication and Management**: Utilizing JWT (JSON Web Tokens), the API handles secure user authentication and session management. Users can register, log in, and manage their profiles, ensuring a personalized and secure user experience.

- **Payment Integration**: Tournest integrates with Stripe for handling secure payment transactions. Users can easily book tours and make payments through the API, which processes transactions and manages financial data securely.

- **Search, Sorting, and Filtering**: Users can search for tours using various parameters such as destination, duration, and price. The API supports advanced sorting and filtering to help users find the perfect tour package according to their preferences.

- **Pagination**: To enhance performance and usability, the API implements pagination in listing tour packages, ensuring that the data is manageable and easily navigable.

- **Booking Management**: The API provides endpoints for managing bookings, including viewing detailed booking information, tracking reservation statuses, and receiving confirmation via emails.

- **Password Recovery**: Features for password recovery are included, allowing users to reset their passwords securely in case they forget them. This process typically involves sending a reset link to the user's registered email address.

- **Rate Limiting**: To ensure fair usage and protect against abuse, the API implements rate limiting. This prevents excessive requests from overloading the server and ensures a smooth experience for all users.

- **Reviews and Ratings**: Users can post reviews and rate tours they have attended. The API handles the collection and retrieval of this feedback, which aids potential customers in making informed decisions.

This REST API is built with robustness and scalability in mind, providing a solid backend foundation for the Tournest web application.

⭐ If you find TourNest useful, please consider giving us a star on GitHub! Your support helps us continue to innovate and deliver exciting features.

![Number of GitHub contributors](https://img.shields.io/github/contributors/endeavourmonk/TourNest)
[![Number of GitHub issues that are open](https://img.shields.io/github/issues/endeavourmonk/TourNest)](https://github.com/endeavourmonk/TourNest/issues)
[![Number of GitHub stars](https://img.shields.io/github/stars/endeavourmonk/TourNest)](https://github.com/endeavourmonk/TourNest/stargazers)
![Number of GitHub closed issues](https://img.shields.io/github/issues-closed/endeavourmonk/TourNest)
![Number of GitHub pull requests that are open](https://img.shields.io/github/issues-pr-raw/endeavourmonk/TourNest)
![GitHub release; latest by date](https://img.shields.io/github/v/release/endeavourmonk/TourNest)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/endeavourmonk/TourNest)
[![GitHub license which is AGPL license](https://img.shields.io/github/license/endeavourmonk/TourNest)](https://github.com/endeavourmonk/TourNest)

## Tournest Backend

This modern REST API is built with:

- **Node.js**: As the runtime environment for executing JavaScript on the server side.
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MongoDB**: Using Mongoose as an ODM (Object Data Modeling) library for MongoDB and Node.js, it manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **Bcrypt.js**: For hashing and securing user passwords.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **Nodemailer**: A module for Node.js applications to allow easy email sending.
- **Stripe**: For processing payments securely.
- **Helmet**: Helps secure Express apps by setting various HTTP headers.
- **Morgan**: HTTP request logger middleware for node.js.
- **Sharp**: For high-performance image processing.
- **Cloudinary**: For managing application’s media assets in the cloud.
- **Dotenv**: Loads environment variables from a `.env` file into `process.env`, providing a safe way to store configuration details out of the code.
- **Express-rate-limit**: Middleware to limit repeated requests to public APIs and/or endpoints such as password reset.
- **Express-mongo-sanitize**: To prevent injection attacks by sanitizing user-supplied data.

### Development Tools:

- **Nodemon**: Utility that monitors for any changes in your source and automatically restarts your server.
- **ESLint**: For enforcing JavaScript code quality and style.
- **Prettier**: An opinionated code formatter that enforces a consistent style by parsing your code and re-printing it with its own rules.
- **eslint-plugin-react**, **eslint-config-airbnb**, **eslint-config-prettier**: These plugins and configurations are used to enhance ESLint by adding React specific linting rules and integrating Airbnb's ESLint configuration with Prettier.

This backend tech stack ensures robust, secure, and maintainable server-side application development for the Tournest platform.

## Branching model

We use the git-flow branching model. The base branch is `develop`. If you are looking for a stable version, please use the main branch or tags labeled as v1.x.x.

## Contributing

Kindly read our [Contributing Guide](CONTRIBUTING.md) to familiarize yourself with Tournest's development process, how to suggest bug fixes and improvements, and the steps for building and testing your changes. <br>

## Contributors

<a href="https://github.com/endeavourmonk/TourNest/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=endeavourmonk/TourNest&max=400&columns=20" />
</a>

## License

TourNest © 2024,Released under the MIT Public License.
