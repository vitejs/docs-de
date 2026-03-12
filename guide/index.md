You can specify additional CLI options like `--port` or `--open`. For a full list of CLI options, run `npx vite --help` in your project.
```bash [npm]
```bash [pnpm]
```bash [npm]
```bash [pnpm]
```bash [npm]
```bash [pnpm]
```bash [npm]
Vite (French word for "quick", pronounced `/viːt/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" aria-label="pronounce" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="../images/voice.svg?no-inline#voice" /></svg></button>, like "veet") is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts:
To learn more about how and when Vite does releases, check out the [Releases](../releases.md) documentation.

To create a project without interactive prompts, you can use the `--no-interactive` flag.

During development, Vite assumes that a modern browser is used. This means the browser supports most of the latest JavaScript and CSS features. For that reason, Vite sets [`esnext` as the transform target](https://esbuild.github.io/api/#target). This prevents syntax lowering, letting Vite serve modules as close as possible to the original source code. Vite injects some runtime code to make the development server work. These code use features included in [Baseline](https://web-platform-dx.github.io/web-features/) Newly Available at the time of each major release (2026-01-01 for this major).
You can also use a tool like [tiged](https://github.com/tiged/tiged) to scaffold your project with one of the templates. Assuming the project is on GitHub and uses `main` as the default branch, you can create a local copy using:
npx tiged user/project my-project
During development, Vite assumes that a modern browser is used. This means the browser supports most of the latest JavaScript and CSS features. For that reason, Vite sets [`esnext` as the transform target](https://esbuild.github.io/api/#target). This prevents syntax lowering, letting Vite serve modules as close as possible to the original source code. Vite injects some runtime code to make the development server work. This code uses features included in [Baseline](https://web-platform-dx.github.io/web-features/) Newly Available at the time of each major release (2026-01-01 for this major).
pnpm link # use your preferred package manager for this step
Then go to your Vite based project and run `pnpm link vite` (or the package manager that you used to link `vite` globally). Now restart the development server to ride on the bleeding edge!
<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq?via=vite" title="Free Vite Course on Scrimba">Learn Vite through interactive tutorials on Scrimba</ScrimbaLink>

<ScrimbaLink href="https://scrimba.com/intro-to-vite-c03p6pbbdq/~0yhj?via=vite" title="Scaffolding Your First Vite Project">Watch an interactive lesson on Scrimba</ScrimbaLink>
