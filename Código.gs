function doGet() {
  const weatherData = getSumareWeather();
  const template = HtmlService.createTemplateFromFile('Index');
  
  template.temp = weatherData.temp;
  template.date = weatherData.date;
  template.description = weatherData.description;
  template.icon = weatherData.icon;
  
  return template.evaluate()
    .setTitle('Dashboard - Leandro')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSumareWeather() {
  try {
    const url = "https://wttr.in/sumaré?format=j1&lang=pt";
    const response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
    const json = JSON.parse(response.getContentText());
    
    const current = json.current_condition[0];
    const tempC = current.temp_C;
    const desc = current.lang_pt ? current.lang_pt[0].value : current.weatherDesc[0].value;
    
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour <= 5;
    let icon = isNight ? "fa-moon" : "fa-sun";

    const descLower = desc.toLowerCase();
    if (descLower.includes("chuva") || descLower.includes("chuvisco")) icon = "fa-cloud-showers-heavy";
    if (descLower.includes("nublado") || descLower.includes("encoberto")) icon = "fa-cloud";
    if (descLower.includes("parcialmente")) icon = isNight ? "fa-cloud-moon" : "fa-cloud-sun";

    return {
      temp: tempC + "°C",
      date: "Sumaré, SP - " + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
      description: desc.toUpperCase(),
      icon: icon
    };
  } catch (e) {
    return {
      temp: "27°C", 
      date: "Sumaré, SP - Sábado",
      description: "SOL COM NUVENS",
      icon: "fa-sun"
    };
  }
}
