# no-missing-types

Makes sure any used package has typescript definitions, whether it's packed within the package or installed as a separate @types package.

For example, if `lodash` is installed, a package that doesn't have its own types, `@types/lodash` is expected to be installed as well.
If `axios` is installed, a package that contains its own types, nothing else needs to be installed.

## Options
Sometimes you want to allow certain packages to be installed without having types, a custom jest-reporter is a great example. In this case, use the `exclude: string[]` option to make this rule ignore those packages and do not fail.
