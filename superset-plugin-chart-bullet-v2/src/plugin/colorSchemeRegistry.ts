import bulletColors from './colorScheme';
import { getCategoricalSchemeRegistry } from '@superset-ui/core';
export default function setupColors() {
  const categoricalSchemeRegistry = getCategoricalSchemeRegistry();
  [bulletColors].forEach(group => {
    group.forEach(scheme => {
      categoricalSchemeRegistry.registerValue(scheme.id, scheme);
    });
  });
  categoricalSchemeRegistry.setDefaultKey('bulletColors');
}
