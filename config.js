async function getConfig() {
  const response = await fetch('/config.json');
  return await response.json();
}

export default getConfig;
