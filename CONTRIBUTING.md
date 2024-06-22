# Contributing to TourNest

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

# Contributing to TourNest Backend

We are thrilled to have you contribute to the TourNest Backend! We aim to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## Setup

1. **Clone the Repository**: Clone the project repository using Git:

   ```
   git clone <repository_url>
   ```

2. **Navigate to the Project Directory**:
   Change into the cloned project directory:

   ```
   cd express
   ```

3. **Install Dependencies**:
   Install the necessary dependencies:

   ```
   npm install
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the root of the project directory and add the following configurations. Make sure to replace the placeholders with your actual values:

   ```
   # Server
   NODE_ENV=development
   PORT=8000

   # DB details
   DB=<your_database>
   DB_PASSWORD=<your_database_password>

   # JWT
   JWT_SECRET=<your_jwt_secret>
   JWT_EXPIRES_IN=<expiration_time>
   JWT_COOKIE_EXPIRES_IN=<cookie_expiration_time>

   # Resend Email Service
   RESEND_USER=resend
   RESEND_API_KEY=<your_resend_api_key>

   # Rate Limiter
   RATE_LIMIT=10000
   RATE_LIMIT_WINDOW=10

   # Cloudinary details
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

   # Stripe
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   ```

5. Start the app: `npm run dev`

## We Develop with GitHub

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## First-time contributors

We've tagged some issues to make it easy to get started 😄
[Good first issues](https://github.com/endeavourmonk/TourNest/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

If you're interested in working on an issue, make sure it has either a `good-first-issue` or `up-for-grabs` label added. Add a comment on the issue and wait for the issue to be assigned before you start working on it. This helps to avoid multiple people working on similar issues.

## We Use [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow), So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase (we use [Git-Flow](https://nvie.com/posts/a-successful-git-branching-model/)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `develop`. Please create the branch in the format feature/<issue-id>-<issue-name> (eg: feature/176-chart-widget)
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure your code lints.
5. Issue that pull request!

## Any contributions you make will be under the MIT License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](https://opensource.org/license/mit) that covers the project.

## Report bugs using GitHub's [issues](https://github.com/endeavourmonk/TourNest/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/endeavourmonk/TourNest/issues/new/choose). It's that easy!

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## Questions?

Contact us [on Twitter](https://x.com/endeavourmonk) or [email us at workwithujjawal@gmail.com](mailto:workwithujjawal@gmail.com).
