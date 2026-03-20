During the production build, Vite will perform necessary transforms so that the URLs still point to the correct location even after bundling and asset hashing. However, the URL string must be static so it can be analyzed, otherwise the code will be left as is, which can cause runtime errors if `build.target` does not support `import.meta.url`.
::: tip Choosing between imports and the `public` directory

In general, prefer **importing assets** unless you specifically need the guarantees provided by the `public` directory.

:::
