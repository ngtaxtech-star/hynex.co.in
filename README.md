# HYNEX Website (Static)

This is a static website (HTML/CSS/JS + assets). It can be hosted directly on GitHub Pages.

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload/push this folder contents to the `main` branch.
3. In GitHub go to `Settings` → `Pages`.
4. Under `Build and deployment`, choose `Source: GitHub Actions`.
5. Wait for the workflow to finish (`Actions` tab). Your site URL will appear in `Settings` → `Pages`.

Notes:
- `server.js` and `Start-Website.*` are only for local preview; GitHub Pages does not run Node servers.
- The workflow deploys only the website files (HTML/CSS/JS + `assets/`), not the local/dev scripts.

## Run locally (optional)

- Double-click `Start-Website.cmd` (Windows), or run `Start-Website.ps1` from PowerShell.
