import { useState, useEffect } from 'react';

interface PreloadOptions {
  priority?: 'high' | 'low' | 'auto';
  imageLoadStrategy?: 'eager' | 'lazy';
  timeout?: number; // Timeout in milliseconds
}

interface ResourceItem {
  src: string;
  type: 'image' | 'style' | 'script' | 'font';
}

/**
 * Custom hook for preloading resources like images, styles, scripts, and fonts
 * 
 * @param resources Array of resource objects containing src and type
 * @param options Preloading options
 * @returns Object containing loading status and progress
 */
function useResourcePreloader(
  resources: ResourceItem[],
  options: PreloadOptions = {}
) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const {
    priority = 'auto',
    imageLoadStrategy = 'lazy',
    timeout = 30000 // Default 30 seconds timeout
  } = options;

  useEffect(() => {
    if (!resources || resources.length === 0) {
      setLoaded(true);
      setProgress(100);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let loadedCount = 0;
    let hasTimedOut = false;

    // Set timeout for entire loading process
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        hasTimedOut = true;
        setError('Resource loading timed out');
        setLoaded(true);
      }, timeout);
    }

    // Create array to track loading status of each resource
    const resourceStatus = resources.map(() => false);

    // Helper to update progress
    const updateProgress = () => {
      loadedCount += 1;
      const newProgress = Math.round((loadedCount / resources.length) * 100);
      setProgress(newProgress);

      if (loadedCount === resources.length && !hasTimedOut) {
        setLoaded(true);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    // Function to load each resource type
    const loadResource = (resource: ResourceItem, index: number) => {
      switch (resource.type) {
        case 'image':
          const img = new Image();
          if (imageLoadStrategy === 'eager') {
            img.loading = 'eager';
          } else {
            img.loading = 'lazy';
          }
          
          img.onload = () => {
            if (!resourceStatus[index]) {
              resourceStatus[index] = true;
              updateProgress();
            }
          };
          
          img.onerror = () => {
            if (!resourceStatus[index]) {
              resourceStatus[index] = true;
              updateProgress();
              setError(`Failed to load image: ${resource.src}`);
            }
          };
          
          img.src = resource.src;
          break;

        case 'style':
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = resource.src;
          
          link.onload = () => {
            if (!resourceStatus[index]) {
              resourceStatus[index] = true;
              updateProgress();
            }
          };
          
          link.onerror = () => {
            if (!resourceStatus[index]) {
              resourceStatus[index] = true;
              updateProgress();
              setError(`Failed to load stylesheet: ${resource.src}`);
            }
          };
          
          document.head.appendChild(link);
          break;

        case 'script':
          const script = document.createElement('script');
          script.src = resource.src;
          script.async = true;
          
          script.onload = () => {
            if (!resourceStatus[index]) {
              resourceStatus[index] = true;
              updateProgress();
            }
          };
          
          script.onerror = () => {
            if (!resourceStatus[index]) {
              resourceStatus[index] = true;
              updateProgress();
              setError(`Failed to load script: ${resource.src}`);
            }
          };
          
          document.body.appendChild(script);
          break;

        case 'font':
          // Using Font Face Observer pattern
          const fontLoader = new Promise<void>((resolve, reject) => {
            if ('fonts' in document) {
              const font = new FontFace('CustomFont', `url(${resource.src})`);
              font.load()
                .then(() => {
                  // Add font to document
                  (document.fonts as any).add(font);
                  if (!resourceStatus[index]) {
                    resourceStatus[index] = true;
                    updateProgress();
                  }
                  resolve();
                })
                .catch(() => {
                  if (!resourceStatus[index]) {
                    resourceStatus[index] = true;
                    updateProgress();
                    setError(`Failed to load font: ${resource.src}`);
                  }
                  reject();
                });
            } else {
              // Fallback for browsers without Font Loading API
              if (!resourceStatus[index]) {
                resourceStatus[index] = true;
                updateProgress();
              }
              resolve();
            }
          });
          break;

        default:
          // Mark unknown resource types as loaded
          if (!resourceStatus[index]) {
            resourceStatus[index] = true;
            updateProgress();
          }
      }
    };

    // Start loading all resources
    resources.forEach((resource, index) => {
      // High priority resources load immediately
      if (priority === 'high') {
        loadResource(resource, index);
      } 
      // Low priority resources are slightly delayed
      else if (priority === 'low') {
        setTimeout(() => loadResource(resource, index), 300);
      } 
      // Auto priority loads critical resources first then the rest
      else {
        const isCritical = ['style', 'font'].includes(resource.type);
        if (isCritical) {
          loadResource(resource, index);
        } else {
          setTimeout(() => loadResource(resource, index), 100);
        }
      }
    });

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [resources, priority, imageLoadStrategy, timeout]);

  return { loaded, error, progress };
}

export default useResourcePreloader;