import { primaryKey, resourceRoutes } from 'src/settings/schema'

/**
 * @param {string} path
 * @param {string} redirect
 * @returns {RouteConfig}
 */
export const redirect = (path, redirect) => {
  return { path, redirect }
}

/**
 * @param {string} source
 * @param {function} component
 * @param {string} [name]
 * @param {Object} [meta]
 * @param {Object|boolean|function} props
 * @returns {RouteConfig}
 */
export const route = (
  source,
  component = undefined,
  name = undefined,
  meta = {},
  props = undefined
) => {
  let path = source
  if (typeof source === 'string') {
    return { path, name, component, meta, props }
  }
  path = source.path
  if (source.component) {
    component = source.component
  }
  if (typeof source.meta === 'object') {
    meta = { ...source.meta, ...meta }
  }
  return { path, name, component, meta, props }
}

/**
 * @param {string} path
 * @param {function} component
 * @param {Array} [children]
 * @param {Object} [meta]
 * @returns {RouteConfig}
 */
export const group = (
  path,
  component,
  children = [],
  meta = {}
) => {
  return { path, component, children, meta: { scope: 'group', ...meta } }
}

/**
 * @param {string} domain
 * @param {string} path
 * @param {function} table
 * @param {function} form
 * @param {Object} [options]
 * @returns {Array<RouteConfig>}
 */
export const crud = (
  domain,
  path,
  table,
  form,
  options = {}
) => {
  let key = primaryKey
  if (options && options.id) {
    key = options.id
    delete options.id
  }

  if (options && options.domain) {
    domain = options.domain
    delete options.domain
  }

  const creator = (resource, component, name, level, scope) => {
    const namespace = `${domain}.${level}`
    const meta = { ...options, scope, domain, level, namespace }
    return route(`${path}/${resource}`, component, `${domain}.${name}`, meta, { path })
  }

  return resourceRoutes(creator, table, form, key, options)
}

/**
 * @param {string|Object} settings
 * @param {Object[]} children
 * @return {RouteConfig}
 */
export const resource = (settings, children = []) => {
  const path = settings.path
  const domain = settings.domain
  const table = settings.table
  const form = settings.form

  const options = settings.options || {}

  const component = () => import('../Components/Group/Group.vue')
  const kids = crud(domain, path, table, form, options)
  const meta = { domain, ...options }

  return group(path, component, [...children, ...kids], meta)
}
