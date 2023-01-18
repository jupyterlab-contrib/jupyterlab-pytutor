# jupyterlab-pytutor

[![Extension status](https://img.shields.io/badge/status-draft-critical 'Not yet working')](https://jupyterlab-contrib.github.io/index.html)[![Github Actions Status](https://github.com/jupyterlab-contrib/jupyterlab-pytutor/workflows/Build/badge.svg)](https://github.com/jupyterlab-contrib/jupyterlab-pytutor/actions/workflows/build.yml)
[![JupyterLite](https://jupyterlite.rtfd.io/en/latest/_static/badge-launch.svg)](https://jupyterlab-pytutor.readthedocs.io/en/latest/lite/lab)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jupyterlab-contrib/jupyterlab-pytutor/HEAD)

A JupyterLab extension for pythontutor.com.
This integrates pytutor for python kernels st. the python code can be inspected by pytutor

![screenshot of jupyterlab-pytutor](https://user-images.githubusercontent.com/591645/212368538-9023c2e9-1e95-4395-81eb-641b1801c782.png)

## Requirements

- JupyterLab >= 3.0

## Install

To install the extension, execute:

```bash
pip install jupyterlab-pytutor
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlab-pytutor
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab-pytutor directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupyterlab-pytutor
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab-pytutor` within that folder.
