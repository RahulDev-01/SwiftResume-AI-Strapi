'use strict';

/**
 * user-resume controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-resume.user-resume', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        ...(ctx.query && ctx.query.populate ? ctx.query.populate : {}),
        Experience: { populate: '*' },
        Education: { populate: '*' },
        Skills: { populate: '*' },
        Projects: { populate: '*' },
        Languages: { populate: '*' },
      },
    };

    const { data, meta } = await super.find(ctx);

    const normalized = Array.isArray(data)
      ? data.map((entry) => {
          const attrs = entry && entry.attributes ? entry.attributes : {};
          return {
            ...entry,
            attributes: {
              ...attrs,
              Experience: Array.isArray(attrs.Experience) ? attrs.Experience : [],
              Education: Array.isArray(attrs.Education) ? attrs.Education : [],
              Skills: Array.isArray(attrs.Skills) ? attrs.Skills : [],
              Projects: Array.isArray(attrs.Projects) ? attrs.Projects : [],
              Languages: Array.isArray(attrs.Languages) ? attrs.Languages : [],
            },
          };
        })
      : data;

    return { data: normalized, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        ...(ctx.query && ctx.query.populate ? ctx.query.populate : {}),
        Experience: { populate: '*' },
        Education: { populate: '*' },
        Skills: { populate: '*' },
        Projects: { populate: '*' },
        Languages: { populate: '*' },
      },
    };

    const { data, meta } = await super.findOne(ctx);

    if (data && data.attributes) {
      const attrs = data.attributes;
      data.attributes = {
        ...attrs,
        Experience: Array.isArray(attrs.Experience) ? attrs.Experience : [],
        Education: Array.isArray(attrs.Education) ? attrs.Education : [],
        Skills: Array.isArray(attrs.Skills) ? attrs.Skills : [],
        Projects: Array.isArray(attrs.Projects) ? attrs.Projects : [],
        Languages: Array.isArray(attrs.Languages) ? attrs.Languages : [],
      };
    }

    return { data, meta };
  },
}));
