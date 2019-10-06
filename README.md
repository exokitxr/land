# XRLAND

This repository is a world made out of worlds on the web. https://root.exokit.org/

```
<xr-site>
  <xr-iframe position="7 0 7" extents="[0 0 15 15]" src="https://supermedium.com/craft"></xr-iframe>
  <xr-iframe position="16 0 16" extents="[16 16 29 29]" src="https://www.cryptovoxels.com/play?vr=enabled"></xr-iframe>
</xr-site>
```

It glues WebXR sites into a connected universe that works with any browser or headset.

## Add a world

To add a world, [open an issue](https://github.com/exokitxr/exoland/issues/new) with the `add-world` tag.

## World requirements

- Must be a WebVR or WebXR site
- Extent dimensions A x 16 by B x 16 for some integer A and B
- Must load in 5 seconds on desktop
- Must run at 90 FPS in VR
- No NSFW content
