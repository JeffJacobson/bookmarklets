(() => {
  
  class Duration {
    hours = 0;
    minutes = 0;
    seconds = 0;
    totalSeconds = 0;
    
    constructor(s) {
      
      const convertToNumberUnitPairs = (part) => {
        const [n, unit] = part.split(' ').map(
          (item, i) => {
            if (i === 0) {
              return parseInt(item);
            }
            // Pluralize singular unit label
            if (!item.endsWith("s")) {
              item += "s"
            }
            return item;
          }
        )
        this[unit] = n;
        
        let multiplier = 1;
        
        if (/^m/i.test(unit)) {
          multiplier = 60
        } else if (/^h/i.test(unit)) {
          multiplier = 60 * 60
        }
        
        this.totalSeconds += n * multiplier;
        
        return [unit, n]
      }
      
      s.split(', ').forEach(convertToNumberUnitPairs)
    }
  }
	

  let times = [
    ...document.body.querySelectorAll(
      ".ytd-thumbnail-overlay-time-status-renderer[aria-label]"
    )
  ].map(node => node.getAttribute('aria-label'));
  
  times = times.slice(1).map(t => new Duration(t));
  
  let sumSeconds = 0;
  
  times.forEach(d => sumSeconds += d.totalSeconds);

	console.log(sumSeconds / 60 / 60);
})()