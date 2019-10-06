# Land

This repository is a world made out of worlds on the web. https://root.exokit.org/

```
<xr-site>
  <xr-iframe position="7 0 7" extents="[0 0 15 15]" src="https://supermedium.com/craft"></xr-iframe>
  <xr-iframe position="16 0 16" extents="[16 16 29 29]" src="https://www.cryptovoxels.com/play?vr=enabled"></xr-iframe>
</xr-site>
```

It glues WebXR sites into a connected virtual universe that works with every browser and headset.

## How it works

This repository is a Github Page at https://root.exokit.org/.

[`index.html`](index.html) references worlds via URL:

```<xr-iframe position="7 0 7" extents="[0 0 15 15]" src="https://supermedium.com/craft">```

Every world has a URL and coordinates -- like a 3D IP address. When you arrive at those coordinates, the browser will load the world at that location, using the URL.

You can explore everything with or without a headset.

## Add a world

To add a world, [open an issue](https://github.com/exokitxr/exoland/issues/new) with the `add-world` tag.

## World requirements

- Must be a WebVR or WebXR site
- Extent dimensions A x 16 by B x 16 for some integer A and B
- Must load in 5 seconds on desktop
- Must run at 90 FPS in VR
- No NSFW
