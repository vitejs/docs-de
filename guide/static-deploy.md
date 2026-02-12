4. Deploy using `npx wrangler pages deploy dist`.
$ npx wrangler pages deploy dist
           uses: actions/deploy-pages@v2
           uses: actions/checkout@v4
           uses: actions/upload-pages-artifact@v2

## Zephyr Cloud

[Zephyr Cloud](https://zephyr-cloud.io) is a deployment platform that integrates directly into your build process and provides global edge distribution for module federation and other kind of applications.

Zephyr follows a different approach than other cloud providers. It integrates directly with Vite build process, so every time you build or run the dev server for your application, it will be automatically deployed with Zephyr Cloud.

Follow the steps in [the Vite deployment guide](https://docs.zephyr-cloud.io/recipes/react-vite) to get started.
   <<< ./static-deploy-github-pages.yaml#content [.github/workflows/deploy.yml]
Deploy your static site using [Kinsta](https://kinsta.com/static-site-hosting/) by following these [instructions](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/react-static-site-examples/#react-with-vite).
Follow the steps in [the Vite deployment guide](https://docs.zephyr-cloud.io/bundlers/vite) to get started.
1. **Update Vite Config**

   Set the correct `base` in `vite.config.js`.
2. **Enable GitHub Pages**

   In your repository, go to **Settings → Pages**. Under **Build and deployment**, open the **Source** dropdown, and select **GitHub Actions**.

   GitHub will now deploy your site using a GitHub Actions [workflow](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows), which is necessary since Vite requires a build step for deployment.

3. **Create a Workflow**

   Create a new file in your repository at `.github/workflows/deploy.yml`. You can also click on **“create your own”** from the previous step, which will generate a starter workflow file for you.

   Here’s a sample workflow that installs dependencies with npm, builds the site, and deploys it whenever you push changes to the `main` branch: