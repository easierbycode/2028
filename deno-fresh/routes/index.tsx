export default function GamePage() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <title>2028.ai — Phaser 4</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="2028.ai" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <link rel="stylesheet" href="/game.css" />
      </head>
      <body>
        <div id="baseUrl" hidden>./</div>
        <div id="phaser-canvas"></div>

        <div id="iosInstallBanner">
          <span
            style="display:inline-block;max-width:280px;line-height:1.4"
          >
            For fullscreen: tap{" "}
            <span style="font-size:16px;vertical-align:middle">&#x1F4E4;</span>{" "}
            then <strong>"Add to Home Screen"</strong>
          </span>
          <button
            id="iosInstallDismiss"
            style="position:absolute;top:4px;right:8px;background:none;border:none;color:#888;font-size:18px;cursor:pointer;padding:4px 8px;line-height:1"
          >
            ×
          </button>
        </div>

        <div id="howtoModal">
          <iframe id="howtoIframe"></iframe>
        </div>

        <script src="/lib/phaser.min.js"></script>
        <script src="/lib/firebase-app-compat.js"></script>
        <script src="/lib/firebase-database-compat.js"></script>
        <script src="/game-boot.js"></script>
      </body>
    </html>
  );
}
