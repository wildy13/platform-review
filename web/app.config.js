export default defineAppConfig({
  ui: {
    primary: 'blue',
    input: {
      color: {
        white: {
          outline: 'shadow-sm bg-white  text-primary-950  ring-1 ring-inset ring-primary-200  focus:ring-2 focus:ring-primary-950',
        },
      },
      default: {
        size: 'lg',
        color: 'white'
      },
    },
    button: {
      color: {
        gray: {
          link: 'text-primary-400  hover:text-primary-700 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 ',
        },
        black: {
          solid: 'shadow-sm text-black hover:text-white  bg-primary-500 hover:bg-primary-500 disabled:bg-primary-950 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500',
        },
      },
      default: {
        color: 'black',
        size: 'lg',
      },
    },
    selectMenu: {
      input: 'block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 text-primary-700  bg-white  border-0 border-b border-primary-200  focus:border-inherit sticky -top-1 -mt-1 mb-1 -mx-1 z-10 placeholder-primary-400  focus:outline-none',
    },
    tooltip: {
      background: 'bg-gray-900 ',
      color: 'text-white',
    },
    skeleton: {
      background: 'bg-primary-100',
    },
  },
});
