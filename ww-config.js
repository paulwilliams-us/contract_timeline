export default {
  editor: {
    label: {
      en: "Timeline",
    },
    icon: "calendar",
  },
  properties: {
    items: {
      label: { en: 'Items' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        { id: '1', content: 'Item 1', start: new Date().toISOString() }
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item.content || item.id || 'Unknown Item';
        },
        item: {
          type: 'Object',
          defaultValue: { id: '', content: '', start: '' },
          options: {
            item: {
              id: { label: { en: 'ID' }, type: 'Text' },
              content: { label: { en: 'Content' }, type: 'Text' },
              start: { label: { en: 'Start Date' }, type: 'Text' },
              end: { label: { en: 'End Date' }, type: 'Text' },
              group: { label: { en: 'Group' }, type: 'Text' },
              type: { label: { en: 'Type' }, type: 'Text' },
              className: { label: { en: 'Class Name' }, type: 'Text' },
              style: { label: { en: 'Style' }, type: 'Text' },
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of timeline items'
      },
      /* wwEditor:end */
    },
    itemsIdFormula: {
      label: { en: 'ID Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['id']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
    },
    itemsContentFormula: {
      label: { en: 'Content Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['content']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
    },
    itemsStartFormula: {
      label: { en: 'Start Date Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['start']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
    },
    itemsEndFormula: {
      label: { en: 'End Date Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['end']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
    },
    itemsTooltipFormula: {
      label: { en: 'Tooltip Content' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['tooltip']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
    },
    itemsBgColorFormula: {
      label: { en: 'Item Background Color' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['bgColor']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A valid CSS color string (e.g. "red", "#ff0000")'
      },
      /* wwEditor:end */
    },
    itemsTextColorFormula: {
      label: { en: 'Item Text Color' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['textColor']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A valid CSS color string'
      },
      /* wwEditor:end */
    },
    itemsBorderColorFormula: {
      label: { en: 'Item Border Color' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['borderColor']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A valid CSS color string'
      },
      /* wwEditor:end */
    },
    groupsLevel1Formula: {
      label: { en: 'Group Level 1 (Top)' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['ship']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
    },
    groupsLevel2Formula: {
      label: { en: 'Group Level 2 (Middle)' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['product']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
    },
    groupsLevel3Formula: {
      label: { en: 'Group Level 3 (Bottom)' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.items) && content.items.length > 0 ? content.items[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['position']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.items) || !content.items?.length || !boundProps.items,
    },
    // Stylings
    itemBackgroundColor: {
      label: { en: 'Item Background' },
      type: 'Color',
      section: 'style',
      defaultValue: '#D5DD26',
      bindable: true,
    },
    itemBorderColor: {
      label: { en: 'Item Border' },
      type: 'Color',
      section: 'style',
      defaultValue: '#97B7D4',
      bindable: true,
    },
    itemTextColor: {
      label: { en: 'Item Text' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1A1A1A',
      bindable: true,
    },
    globalFontFamily: {
      label: { en: 'Global Font Family' },
      type: 'FontFamily',
      section: 'settings',
      defaultValue: 'Inter, sans-serif',
      bindable: true,
    },
    globalFontSize: {
      label: { en: 'Global Font Size' },
      type: 'Length',
      section: 'settings',
      defaultValue: '14px',
      bindable: true,
    },
    groupLvl1Color: {
      label: { en: 'Lvl 1 (Top) Bg Color' },
      type: 'Color',
      section: 'settings',
      defaultValue: '#f8fafc',
      bindable: true
    },
    groupLvl1TextColor: {
      label: { en: 'Lvl 1 Text Color' },
      type: 'Color',
      section: 'settings',
      defaultValue: '#0f172a',
      bindable: true
    },
    groupLvl1FontSize: {
      label: { en: 'Lvl 1 Font Size' },
      type: 'Length',
      section: 'settings',
      defaultValue: '14px',
      bindable: true
    },
    groupLvl1FontWeight: {
      label: { en: 'Lvl 1 Font Weight' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: '400', label: 'Normal' },
          { value: '500', label: 'Medium' },
          { value: '600', label: 'SemiBold' },
          { value: '700', label: 'Bold' },
        ]
      },
      defaultValue: '700',
      bindable: true
    },
    groupLvl2Color: {
      label: { en: 'Lvl 2 (Mid) Bg Color' },
      type: 'Color',
      section: 'settings',
      defaultValue: '#ffffff',
      bindable: true
    },
    groupLvl2TextColor: {
      label: { en: 'Lvl 2 Text Color' },
      type: 'Color',
      section: 'settings',
      defaultValue: '#334155',
      bindable: true
    },
    groupLvl2FontSize: {
      label: { en: 'Lvl 2 Font Size' },
      type: 'Length',
      section: 'settings',
      defaultValue: '13px',
      bindable: true
    },
    groupLvl2FontWeight: {
      label: { en: 'Lvl 2 Font Weight' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: '400', label: 'Normal' },
          { value: '500', label: 'Medium' },
          { value: '600', label: 'SemiBold' },
          { value: '700', label: 'Bold' },
        ]
      },
      defaultValue: '500',
      bindable: true
    },
    groupLvl3Color: {
      label: { en: 'Lvl 3 (Bot) Bg Color' },
      type: 'Color',
      section: 'settings',
      defaultValue: '#ffffff',
      bindable: true
    },
    groupLvl3TextColor: {
      label: { en: 'Lvl 3 Text Color' },
      type: 'Color',
      section: 'settings',
      defaultValue: '#64748b',
      bindable: true
    },
    groupLvl3FontSize: {
      label: { en: 'Lvl 3 Font Size' },
      type: 'Length',
      section: 'settings',
      defaultValue: '12px',
      bindable: true
    },
    groupLvl3FontWeight: {
      label: { en: 'Lvl 3 Font Weight' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: '400', label: 'Normal' },
          { value: '500', label: 'Medium' },
          { value: '600', label: 'SemiBold' },
          { value: '700', label: 'Bold' },
        ]
      },
      defaultValue: '400',
      bindable: true
    },
    // AXIS STYLING
    axisYearTextColor: {
      label: { en: 'Year/Major Text Color' },
      type: 'Color',
      section: 'settings',
      defaultValue: '#334155',
      bindable: true
    },
    axisYearFontSize: {
      label: { en: 'Year/Major Font Size' },
      type: 'Length',
      section: 'settings',
      defaultValue: '12px',
      bindable: true
    },
    axisYearFontWeight: {
      label: { en: 'Year/Major Font Weight' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: '400', label: 'Normal' },
          { value: '600', label: 'SemiBold' },
          { value: '700', label: 'Bold' },
        ]
      },
      defaultValue: '700',
      bindable: true
    },
    axisDateTextColor: {
      label: { en: 'Date/Minor Text Color' },
      type: 'Color',
      section: 'settings',
      defaultValue: '#64748b',
      bindable: true
    },
    axisDateFontSize: {
      label: { en: 'Date/Minor Font Size' },
      type: 'Length',
      section: 'settings',
      defaultValue: '12px',
      bindable: true
    },
    axisDateFontWeight: {
      label: { en: 'Date/Minor Font Weight' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: '400', label: 'Normal' },
          { value: '500', label: 'Medium' },
        ]
      },
      defaultValue: '400',
      bindable: true
    },
    itemBorderRadius: {
      label: { en: 'Item Border Radius' },
      type: 'Length',
      section: 'style',
      defaultValue: '4px',
      bindable: true,
    },
    itemVerticalMargin: {
      label: { en: 'Item Vertical Margin' },
      type: 'Length',
      section: 'style',
      defaultValue: '10px',
      bindable: true,
    },
    zoomLevel: {
      label: { en: 'Zoom Level' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: '1m', label: '1 Month' },
          { value: '3m', label: '3 Months' },
          { value: '6m', label: '6 Months' },
          { value: '1y', label: '1 Year' },
          { value: '3y', label: '3 Years' },
        ]
      },
      defaultValue: '1m',
      bindable: true,
    },
    verticalScroll: {
      label: { en: 'Vertical Scroll' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
    },
    horizontalScroll: {
      label: { en: 'Horizontal Scroll' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
    },
  },
  triggerEvents: [
    { name: 'onItemSelect', label: { en: 'On Item Select' }, event: { item: {}, id: '' } },
    { name: 'onItemDoubleClick', label: { en: 'On Item Double Click' }, event: { item: {}, id: '' } },
    { name: 'onBackgroundClick', label: { en: 'On Background Click' }, event: { time: null, group: null } },
    { name: 'onTimeSelect', label: { en: 'On Time Select (Double Click)' }, event: { time: null, group: null } },
  ],
};
