export default defineAppConfig({
  ui: {
    primary: 'slate',
    input: {
      color: {
        white: {
          outline: 'shadow-sm bg-white dark:bg-primary-900 text-primary-950 dark:text-white ring-1 ring-inset ring-primary-200 dark:ring-primary-700 focus:ring-2 focus:ring-primary-950 dark:focus:ring-primary-400',
        },
      },
      default: {
        size: 'lg',
      },
    },
    button: {
      color: {
        gray: {
          link: 'text-primary-400 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
        },
        black: {
          solid: 'shadow-sm text-white dark:text-primary-950 bg-primary-950 hover:bg-primary-950 disabled:bg-primary-950 dark:bg-white dark:hover:bg-primary-100 dark:disabled:bg-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
        },
      },
      default: {
        color: 'black',
        size: 'lg',
      },
    },
    selectMenu: {
      input: 'block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 text-primary-700 dark:text-primary-200 bg-white dark:bg-primary-800 border-0 border-b border-primary-200 dark:border-primary-700 focus:border-inherit sticky -top-1 -mt-1 mb-1 -mx-1 z-10 placeholder-primary-400 dark:placeholder-primary-500 focus:outline-none',
    },
    tooltip: {
      background: 'bg-gray-900 dark:bg-white',
      color: 'text-white dark:text-gray-900',
    },
    skeleton: {
      background: 'bg-primary-100 dark:bg-primary-800',
    },
  },
});
