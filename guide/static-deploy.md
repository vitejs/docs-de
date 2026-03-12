<!--
  READ THIS IF YOU WANT TO ADD A NEW DEPLOYMENT PLATFORM.

  Feel free to submit a PR that adds a new section with a link to your platform's
  deployment guide, as long as it meets these criteria:

  1. Users should be able to deploy their site for free.
  2. Free tier offerings should host the site indefinitely and are not time-bound.
     Offering a limited number of computation resource or site counts in exchange is fine.
  3. The linked guides should not contain any malicious content.

  New sections should be added last in the file. Please reference the existing sections at
  the bottom of this file for examples of how to format the new section.

  The Vite team may change the criteria and audit the current list from time to time.
  If a section is removed, we will ping the original PR authors before doing so.
-->

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
You can also deploy to a [custom domain](https://surge.sh/help/adding-a-custom-domain) by adding `surge dist yourdomain.com`.

## EdgeOne Pages

Deploy your static site using [EdgeOne Pages](https://edgeone.ai/products/pages) by following these [instructions](https://pages.edgeone.ai/document/vite).
1. Install the [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/) via `npm install -g netlify-cli`.
2. Create a new site using `netlify init`.
3. Deploy using `netlify deploy`.
The Netlify CLI will share with you a preview URL to inspect. When you are ready to go into production, use the `prod` flag: `netlify deploy --prod`.
1. Install the [Vercel CLI](https://vercel.com/cli) via `npm i -g vercel` and run `vercel` to deploy.
### Vercel with Git
1. Install [firebase-tools](https://www.npmjs.com/package/firebase-tools) via `npm i -g firebase-tools`.

2. Create the following files at the root of your project:
   ::: code-group
   :::

1. Install [surge](https://www.npmjs.com/package/surge) via `npm i -g surge`.
5. Click **Create Static Site**. Your app should be deployed at `https://<PROJECTNAME>.onrender.com/`.
## Cloudflare
### Cloudflare Workers
The [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) provides integration with Cloudflare Workers and uses Vite's Environment API to run your server-side code in the Cloudflare Workers runtime during development.

To add Cloudflare Workers to an existing Vite project, install the plugin and add it to your config:
$ npm install --save-dev @cloudflare/vite-plugin
```
```js [vite.config.js]
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
export default defineConfig({
  plugins: [cloudflare()],
})
```
```jsonc [wrangler.jsonc]
{
  "name": "my-vite-app",
}
After running `npm run build`, your application can now be deployed with `npx wrangler deploy`.

You can also easily add backend APIs to your Vite application to securely communicate with Cloudflare resources. This runs in the Workers runtime during development and deploys alongside your frontend. See the [Cloudflare Vite plugin tutorial](https://developers.cloudflare.com/workers/vite-plugin/tutorial/) for a complete walkthrough.

### Cloudflare Pages

#### Cloudflare Pages with Git
Cloudflare Pages gives you a way to deploy directly to Cloudflare without having to manage a Wrangler file.
2. Log in to the Cloudflare dashboard and select your account in **Account Home** > **Workers & Pages**.
3. Select **Create a new Project** and the **Pages** option, then select Git.
5. Select the corresponding framework preset in the build setting depending on the Vite framework you have selected. Otherwise enter your build commands for your project and your expected output directory.
After your project has been imported and deployed, all subsequent pushes to branches will generate [Preview Deployments](https://developers.cloudflare.com/pages/platform/preview-deployments/) unless specified not to in your [branch build controls](https://developers.cloudflare.com/pages/platform/branch-build-controls/). All changes to the Production Branch (commonly "main") will result in a Production Deployment.
After your project has been imported and deployed, all subsequent pushes to branches other than the production branch along with pull requests will generate [Preview Deployments](https://docs.netlify.com/deploy/deploy-types/deploy-previews/), and all changes made to the Production Branch (commonly “main”) will result in a [Production Deployment](https://docs.netlify.com/deploy/deploy-overview/#definitions).