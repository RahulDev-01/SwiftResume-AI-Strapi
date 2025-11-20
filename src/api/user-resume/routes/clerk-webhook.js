'use strict';

/**
 * Custom routes for Clerk webhook
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/user-resumes/clerk-webhook',
      handler: 'clerk-webhook.handleWebhook',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
