<template>
  <div class="SchemaDebugger">
    <details>
      <summary>{{ label }}</summary>
      <div
        class="pre debug"
        v-html="beautify(inspect)"
      />
    </details>
  </div>
</template>

<script type="text/javascript">
export default {
  /**
   */
  name: 'SchemaDebugger',
  /**
   */
  props: {
    label: {
      type: String,
      default: () => ''
    },
    // eslint-disable-next-line
    inspect: {
      default: () => undefined
    }
  },
  /**
   */
  computed: {
    /**
     * @returns {boolean}
     */
    debug () {
      if (this.$store.getters['app/getDebuggers']) {
        return true
      }
      return process.env.NODE_ENV !== 'production'
    }
  },
  /**
   */
  methods: {
    /**
     * @param {*} json
     * @returns {void | string | never}
     */
    beautify (json) {
      if (!json) {
        json = {}
      }
      json = JSON.stringify(json, undefined, 4)
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')

      /* eslint-disable no-useless-escape */
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number'
        if (match.startsWith('"')) {
          if (match.endsWith(':')) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (match.includes('null')) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    }
  }
}
</script>

<style
  lang="stylus"
  rel="stylesheet/stylus"
>
.SchemaDebugger {
  border 1px dotted #d0d0d0
  margin 10px 0
  padding 10px
  border-radius 2px
  background #ffffff

  summary {
    cursor pointer
    padding 5px 10px
  }

  .pre {
    padding 0 20px
    font-family monospace
    overflow auto
    white-space pre

    .string {
      color #cf8500
    }

    .number {
      color #d70000
    }

    .boolean {
      color #0e12ca
    }

    .null {
      color #9a009a
    }

    .key {
      color green
    }
  }
}

details[open] summary ~ * {
  animation debug .5s
}

@keyframes debug {
  0% {
    opacity 0
    margin-top -10px
  }
  100% {
    opacity 1
    margin-top 0
  }
}
</style>
