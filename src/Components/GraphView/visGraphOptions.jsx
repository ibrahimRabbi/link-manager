const visGraphOptions = {
  // nodes styles
  nodes: {
    borderWidth: 1,
    borderWidthSelected: 2,
    chosen: true,
    color: {
      border: '#2B7CE9',
      background: '#97C2FC',
      highlight: {
        border: '#75a9eb',
        background: '#ededee',
      },
      hover: {
        border: '#2B7CE9',
        background: '#ededee',
      },
    },
    fixed: {
      x: false,
      y: false,
    },
    font: {
      color: '#1c1616',
      size: 14, // px
      face: 'arial',
      background: 'none',
      strokeWidth: 0, // px
      strokeColor: '#ffffff',
      align: 'center',
      multi: true,
      vadjust: 0,
      bold: {
        color: '#343434',
        size: 12, // px
        face: 'arial',
        vadjust: 0,
        mod: 'bold',
      },
      ital: {
        color: '#343434',
        size: 12, // px
        face: 'arial',
        vadjust: 0,
        mod: 'italic',
      },
      boldital: {
        color: '#343434',
        size: 12, // px
        face: 'arial',
        vadjust: 0,
        mod: 'bold italic',
      },
      mono: {
        color: '#343434',
        size: 12, // px
        face: 'courier new',
        vadjust: 2,
        mod: '',
      },
    },
    group: undefined,
    labelHighlightBold: true,
    level: undefined,
    mass: 1.1,
    physics: true,
    scaling: {
      min: 29,
      max: 30,
      label: {
        enabled: true,
        min: 14,
        max: 30,
        maxVisible: 10,
        drawThreshold: 5,
      },
    },
    shadow: {
      enabled: false,
      color: 'rgba(0,0,0,0.5)',
      size: 10,
      x: 5,
      y: 5,
    },
    shape: 'circle',
    shapeProperties: {
      borderDashes: false, // only for borders
      borderRadius: 50, // only for box shape
      interpolation: false, // only for image and circularImage shapes
      useImageSize: false, // only for image and circularImage shapes
      useBorderWithImage: false, // only for image shape
    },
    // size: 50,
    widthConstraint: 65,
    heightConstraint: 65,
  },

  edges: {
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.7,
        type: 'arrow',
      },
      middle: {
        enabled: false,
        imageHeight: 32,
        imageWidth: 32,
        scaleFactor: 1,
        src: 'https://visjs.org/images/visjs_logo.png',
        type: 'image',
      },
      from: {
        enabled: false,
        imageHeight: 25,
        imageWidth: 25,
        scaleFactor: 1,
        src: '',
        type: 'image',
      },
    },
    endPointOffset: {
      from: 0,
      to: 0,
    },
    arrowStrikethrough: false,
    chosen: true,
    color: {
      color: '#848484',
      highlight: '#848484',
      hover: '#848484',
      inherit: 'from',
      opacity: 1.0,
    },
    dashes: false,
    font: {
      color: '#343434',
      size: 12, // px
      face: 'arial',
      background: 'none',
      strokeWidth: 1.5, // px
      strokeColor: '#ffffff',
      align: 'middle',
      multi: true,
      vadjust: 0,
      bold: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        vadjust: 0,
        mod: 'bold',
      },
      ital: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        vadjust: 0,
        mod: 'italic',
      },
      boldital: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        vadjust: 0,
        mod: 'bold italic',
      },
      mono: {
        color: '#343434',
        size: 15, // px
        face: 'courier new',
        vadjust: 2,
        mod: '',
      },
    },
    hidden: false,
    hoverWidth: 1,
    label: undefined,
    labelHighlightBold: true,
    length: undefined,
    physics: true,
    scaling: {
      min: 10,
      max: 15,
      label: {
        enabled: true,
        min: 14,
        max: 30,
        maxVisible: 30,
        drawThreshold: 10,
      },
    },
    selectionWidth: 1,
    shadow: {
      enabled: false,
      color: 'rgba(0,0,0,0.5)',
      size: 10,
      x: 5,
      y: 5,
    },
    smooth: {
      enabled: true,
      type: 'dynamic',
      roundness: 0.5,
    },
    title: undefined,
    value: undefined,
    width: 2,
    widthConstraint: false,
  },

  // display configure options
  configure: {
    enabled: false,
    filter: 'nodes, edges',
    showButton: true,
  },

  layout: {
    improvedLayout: false,
    clusterThreshold: 1,
    randomSeed: 1,
    hierarchical: {
      enabled: false, //change to true to see the other graph
      direction: 'DU',
      sortMethod: 'directed',
      levelSeparation: 200,
      nodeSpacing: 100,
    },
  },
  groups: {
    useDefaultGroups: true,
    myGroupId: {},
  },
  physics: {
    enabled: true,
    // handle node and edges gravity
    barnesHut: {
      gravitationalConstant: -3000,
      centralGravity: 0.1,
      springLength: 150,
      springConstant: 0.02,
      damping: 0.1,
      avoidOverlap: 0,
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0,
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09,
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09,
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true,
    },
    timestep: 0.5,
    adaptiveTimestep: true,
  },
  interaction: {
    dragNodes: true,
    dragView: true,
    hideEdgesOnDrag: false,
    hideEdgesOnZoom: false,
    hideNodesOnDrag: false,
    hover: true,
    hoverConnectedEdges: true,
    keyboard: {
      enabled: false,
      speed: { x: 10, y: 10, zoom: 0.02 },
      bindToWindow: true,
    },
    multiselect: false,
    navigationButtons: true,
    selectable: true,
    selectConnectedEdges: true,
    tooltipDelay: 300,
    zoomSpeed: 1,
    zoomView: true,
  },
  manipulation: {
    enabled: false,
    initiallyActive: false,
    addNode: true,
    addEdge: true,
    editNode: () => {},
    editEdge: true,
    deleteNode: true,
    deleteEdge: true,
    controlNodeStyle: {},
  },
};

export default visGraphOptions;
