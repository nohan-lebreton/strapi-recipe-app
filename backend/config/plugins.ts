export default {
  'upload': {
    enabled: true,
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 10 * 1024 * 1024
      }
    }
  }
};
