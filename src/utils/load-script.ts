export async function loadScript(config: {
  url?: string | null;
  script?: string | null;
}) {
  if (config.url) {
    config.script = await fetch(config.url).then((r) => r.text());
  }
  if (!config.script) {
    return;
  }
  const runner = new Function(config.script);
  runner();
}
