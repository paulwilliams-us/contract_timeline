<template>
  <div class="ww-timeline" :style="customStyle">
    <div class="navigation-menu">
        <div class="menu-group">
            <button @click="move(0.2)" aria-label="Move Left"><i class="fas fa-chevron-left"></i></button>
            <button @click="move(-0.2)" aria-label="Move Right"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="menu-group">
            <button @click="zoom(-0.2)" aria-label="Zoom In"><i class="fas fa-plus"></i></button>
            <button @click="zoom(0.2)" aria-label="Zoom Out"><i class="fas fa-minus"></i></button>
        </div>
        <div class="menu-group">
            <button @click="adjustWindow()" aria-label="Fit All"><i class="fas fa-expand"></i></button>
        </div>
    </div>
    <div ref="timelineContainer" class="timeline-container"></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch, computed } from "vue";
import { Timeline, DataSet } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.css";
// import moment from "moment"; // Not strictly needed if using native Dates, but good for manipulation

export default {
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  setup(props, { emit }) {
    const timelineContainer = ref(null);
    let timelineInstance = null;
    let itemsDataSet = new DataSet([]);
    let groupsDataSet = new DataSet([]);
    
    // NOTE: Removed groupsDataSet as requested to simplify

    const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

    /* wwEditor:start */
    const isEditing = computed(() => props.wwEditorState.isEditing);
    /* wwEditor:end */

    const customStyle = computed(() => {
      return {
        "--global-font-family": props.content?.globalFontFamily || "Inter, sans-serif",
        "--global-font-size": props.content?.globalFontSize || "14px",
        "--group-lvl1-bg": props.content?.groupLvl1Color || "#f8fafc",
        "--group-lvl1-color": props.content?.groupLvl1TextColor || "#0f172a",
        "--group-lvl1-size": props.content?.groupLvl1FontSize || "14px",
        "--group-lvl1-weight": props.content?.groupLvl1FontWeight || "700",

        "--group-lvl2-bg": props.content?.groupLvl2Color || "#ffffff",
        "--group-lvl2-color": props.content?.groupLvl2TextColor || "#334155",
        "--group-lvl2-size": props.content?.groupLvl2FontSize || "13px",
        "--group-lvl2-weight": props.content?.groupLvl2FontWeight || "500",

        "--group-lvl3-bg": props.content?.groupLvl3Color || "#ffffff",
        "--group-lvl3-color": props.content?.groupLvl3TextColor || "#64748b",
        "--group-lvl3-size": props.content?.groupLvl3FontSize || "12px",
        "--group-lvl3-weight": props.content?.groupLvl3FontWeight || "400",

        "--axis-year-color": props.content?.axisYearTextColor || "#334155",
        "--axis-year-size": props.content?.axisYearFontSize || "12px",
        "--axis-year-weight": props.content?.axisYearFontWeight || "700",

        "--axis-date-color": props.content?.axisDateTextColor || "#64748b",
        "--axis-date-size": props.content?.axisDateFontSize || "12px",
        "--axis-date-weight": props.content?.axisDateFontWeight || "400",

        "--item-bg-color": props.content?.itemBackgroundColor || "#D5DD26",
        "--item-border-color": props.content?.itemBorderColor || "#97B7D4",
        "--item-text-color": props.content?.itemTextColor || "#1A1A1A",
        "--item-border-radius": props.content?.itemBorderRadius || "4px",
      };
    });

    const timelineItems = computed(() => {
        const rawItems = props.content?.items || [];
        if (!Array.isArray(rawItems)) return { items: [], groups: [] };

        const groupsMap = new Map();
        const processedItems = [];

        rawItems.forEach((item) => {
            // Resolve standard fields
            const id = resolveMappingFormula(props.content?.itemsIdFormula, item) ?? item.id;
            const content = resolveMappingFormula(props.content?.itemsContentFormula, item) ?? item.content;
            const start = resolveMappingFormula(props.content?.itemsStartFormula, item) ?? item.start;
            const end = resolveMappingFormula(props.content?.itemsEndFormula, item) ?? item.end;
            const tooltip = resolveMappingFormula(props.content?.itemsTooltipFormula, item) ?? item.title ?? '';
            
            // Dynamic Item Styling
            const bgColor = resolveMappingFormula(props.content?.itemsBgColorFormula, item);
            const textColor = resolveMappingFormula(props.content?.itemsTextColorFormula, item);
            const borderColor = resolveMappingFormula(props.content?.itemsBorderColorFormula, item);
            
            // Build style string if dynamic colors exist
            let style = '';
            if (bgColor) style += `background-color: ${bgColor}; border-color: ${bgColor};`;
            if (borderColor) style += `border-color: ${borderColor};`; // Override border if specific
            if (textColor) style += `color: ${textColor};`;
            
            // Resolve Group Levels
            const lvl1 = resolveMappingFormula(props.content?.groupsLevel1Formula, item) ?? 'Unassigned';
            const lvl2 = resolveMappingFormula(props.content?.groupsLevel2Formula, item) ?? 'Unassigned';
            const lvl3 = resolveMappingFormula(props.content?.groupsLevel3Formula, item) ?? 'Unassigned';

            // Generate Group IDs
            const id1 = `g1_${String(lvl1).replace(/\s+/g, '_')}`;
            const id2 = `g2_${String(lvl1).replace(/\s+/g, '_')}_${String(lvl2).replace(/\s+/g, '_')}`;
            const id3 = `g3_${String(lvl1).replace(/\s+/g, '_')}_${String(lvl2).replace(/\s+/g, '_')}_${String(lvl3).replace(/\s+/g, '_')}`;

            // Build Group Structure
            // Level 1 (Top)
            if (!groupsMap.has(id1)) {
                groupsMap.set(id1, {
                    id: id1,
                    content: lvl1,
                    treeLevel: 1,
                    nestedGroups: [], // Will hold id2s
                    className: 'group-level-1'
                });
            }
            
            // Level 2 (Middle)
            if (!groupsMap.has(id2)) {
                // Link to Parent L1
                const parent = groupsMap.get(id1);
                if (!parent.nestedGroups.includes(id2)) {
                    parent.nestedGroups.push(id2);
                }
                
                groupsMap.set(id2, {
                    id: id2,
                    content: lvl2,
                    treeLevel: 2,
                    nestedGroups: [], // Will hold id3s
                    className: 'group-level-2'
                });
            }

            // Level 3 (Bottom - where items live)
            if (!groupsMap.has(id3)) {
                // Link to Parent L2
                const parent = groupsMap.get(id2);
                if (!parent.nestedGroups.includes(id3)) {
                    parent.nestedGroups.push(id3);
                }

                groupsMap.set(id3, {
                    id: id3,
                    content: lvl3,
                    treeLevel: 3,
                    className: 'group-level-3'
                });
            }

            // Add Item assigned to Level 3 Group via "group" property
            processedItems.push({
                id: id,
                content: content,
                title: tooltip, // Tooltip content (HTML supported)
                start: start ? new Date(start) : new Date(),
                end: end ? new Date(end) : null,
                group: id3,
                style: style // Apply dynamic styles
            });
        });
        
        return {
            items: processedItems,
            groups: Array.from(groupsMap.values())
        };
    });

    const initTimeline = () => {
        if (!timelineContainer.value) return;

        // Configuration options
        const options = {
            height: "100%",
            width: "100%",
            stack: true, // Items stack on top of each other
            zoomKey: "ctrlKey",
            orientation: { axis: "top", item: "top" },
            // CRITICAL: Force start/end to be Dates to prevent 'number' axis
            start: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
            end: new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 7),   // 7 days ahead
            showCurrentTime: true,
            groupHeightMode: 'auto', // Important for nested groups
            tooltip: {
                followMouse: true,
                overflowMethod: 'cap'
            },
            margin: {
                item: {
                    vertical: parseInt(props.content.itemVerticalMargin) || 10,
                    horizontal: 10 // Keeping horizontal standard for now
                }
            },
            verticalScroll: props.content.verticalScroll,
            horizontalScroll: props.content.horizontalScroll,
        };

        // Initialize with both Items and Groups
        // Note: We pass just the data, options come 3rd
        timelineInstance = new Timeline(timelineContainer.value, itemsDataSet, groupsDataSet, options);
        
        timelineInstance.on('select', (properties) => {
            if (properties.items && properties.items.length > 0) {
                 const selectedId = properties.items[0];
                 const selectedObj = timelineItems.value.items.find(i => i.id == selectedId);
                 emit('trigger-event', { name: 'onItemSelect', event: { item: selectedObj, id: selectedId } });
            }
        });

        timelineInstance.on('doubleClick', (properties) => {
            if (properties.item) {
                 const selectedId = properties.item;
                 const selectedObj = timelineItems.value.items.find(i => i.id == selectedId);
                 emit('trigger-event', { name: 'onItemDoubleClick', event: { item: selectedObj, id: selectedId } });
            } else if (properties.what === 'background' || properties.what === 'axis') {
                 // Double click on empty space -> Create new item at this time
                 emit('trigger-event', { 
                     name: 'onTimeSelect', 
                     event: { 
                         time: properties.time, 
                         group: properties.group 
                     } 
                 });
            }
        });

        timelineInstance.on('click', (properties) => {
            if (!properties.item && properties.what === 'background') {
                 emit('trigger-event', { 
                     name: 'onBackgroundClick', 
                     event: { 
                         time: properties.time, 
                         group: properties.group 
                     } 
                 });
            }
        });
    };

    // Watch for items AND config changes to rebuild data
    watch(timelineItems, (data) => {
        console.log('UseWeWeb: Data updated', data);
        if (data) {
             const { items, groups } = data;
             
             // Update Groups
             groupsDataSet.clear();
             if (groups && groups.length > 0) {
                 groupsDataSet.add(groups);
             }

             // Update Items
             itemsDataSet.clear();
             if (items && items.length > 0) {
                 itemsDataSet.add(items);
             }
             
             if (timelineInstance) {
                // If this is the FIRST load or meaningful update, apply zoom
                // You might want a flag to prevent re-zooming on every small update if desired
                // But for now, ensuring the view is correct is key.
                applyZoomLevel(); 
                timelineInstance.redraw(); 
             }
        }
    }, { deep: true, immediate: true });

    // Watch for configuration/style changes
    watch(() => props.content, () => {
        if(timelineInstance) {
             // specific check for margin update if needed, but redraw handles most style changes
             // For deep config changes like margin, we might need setOptions
             timelineInstance.setOptions({
                margin: {
                    item: {
                        vertical: parseInt(props.content.itemVerticalMargin) || 10,
                        horizontal: 10
                    }
                },
                verticalScroll: props.content.verticalScroll,
                horizontalScroll: props.content.horizontalScroll
             });
             timelineInstance.redraw(); 
        }
    }, { deep: true });



    const move = (percentage) => {
        if (!timelineInstance) return;
        const range = timelineInstance.getWindow();
        const interval = range.end - range.start;
        
        timelineInstance.setWindow({
            start: new Date(range.start.valueOf() - interval * percentage),
            end: new Date(range.end.valueOf() - interval * percentage),
        });
    };

    const zoom = (percentage) => {
        if (!timelineInstance) return;
        const range = timelineInstance.getWindow();
        const interval = range.end - range.start;

        const newStart = range.start.valueOf() - interval * percentage * 0.5;
        const newEnd = range.end.valueOf() + interval * percentage * 0.5;

        timelineInstance.setWindow({
            start: new Date(newStart),
            end: new Date(newEnd),
        });
    };

    const adjustWindow = () => {
        if (timelineInstance) {
            timelineInstance.fit();
        }
    };

    const applyZoomLevel = () => {
        if (!timelineInstance) return;
        
        const targetZoom = props.content?.zoomLevel || '1m';
        
        const now = new Date().valueOf();
        let start, end;
        
        // Helper to calc duration in ms
        const days = (d) => d * 24 * 60 * 60 * 1000;
        
        // We position "Now" at roughly 20% from the start of the view for context
        // and 80% into the future.
        switch (targetZoom) {
            case '3m':
                start = now - days(10);
                end = now + days(80);
                break;
            case '6m':
                start = now - days(20);
                end = now + days(160);
                break;
            case '1y':
                start = now - days(30);
                end = now + days(335);
                break;
            case '3y':
                start = now - days(90);
                end = now + days(1005);
                break;
            case '1m':
            default:
                start = now - days(5); // 5 days back
                end = now + days(25);  // 25 days forward
                break;
        }
        
        timelineInstance.setWindow(new Date(start), new Date(end), { animation: true });
    };

    // Watch prop zoom changes
    watch(() => props.content?.zoomLevel, (newVal) => {
        if (newVal) {
            applyZoomLevel();
        }
    });

    onMounted(() => {
        initTimeline();
        // Initial load
        groupsDataSet.clear();
        if (timelineItems.value.groups) {
             groupsDataSet.add(timelineItems.value.groups);
        }
        itemsDataSet.clear();
        if (timelineItems.value.items) {
            itemsDataSet.add(timelineItems.value.items);
        }
        
        // Apply initial zoom
        applyZoomLevel();

        // Force a redraw after a tick to ensure flex layout is calculated
        setTimeout(() => {
             if (timelineInstance) {
                timelineInstance.redraw();
                console.log('UseWeWeb: Timeline redrawn. Container height:', timelineContainer.value?.offsetHeight);
             }
        }, 500); // Increased timeout to 500ms to be safe

        // Responsive handling
        const resizeObserver = new ResizeObserver(() => {
            if (timelineInstance) {
                timelineInstance.redraw();
            }
        });
        if (timelineContainer.value) {
            resizeObserver.observe(timelineContainer.value);
        }
    });

    onUnmounted(() => {
        if (timelineInstance) {
            timelineInstance.destroy();
        }
    });

    return {
      timelineContainer,
      customStyle,
      setZoom: (val)=>currentZoom.value=val, // Keep for compatibility if needed, though strictly internal now
      move,
      zoom,
      adjustWindow
    };
  },
};
</script>


<style lang="scss" scoped>
.ww-timeline {
  width: 100%;
  height: 100%;
  min-height: 200px;
  position: relative;
  font-family: var(--global-font-family);

  .navigation-menu {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1000;
      display: flex;
      gap: 6px;
      padding: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      .menu-group {
          display: flex;
          gap: 2px;
          
          button {
              width: 30px;
              height: 30px;
              border: 1px solid #ccc;
              background: white;
              cursor: pointer;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #555;
              transition: all 0.2s;
              
              &:hover {
                  background: #f0f0f0;
                  color: #333;
              }
              
              /* Optional: Add icons if available, otherwise text content fallback */
              i {
                  pointer-events: none;
              }
          }
      }
  }

  .timeline-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
  }

  /* Deep selectors to style vis-timeline internal elements */
  /* 2. Headers (Time Axis) */
  ::v-deep .vis-time-axis .vis-text {
      color: var(--axis-date-color);
      font-size: var(--axis-date-size);
      font-weight: var(--axis-date-weight);
      padding-top: 4px;
      padding-left: 4px;
  }

  ::v-deep .vis-time-axis .vis-text.vis-major {
      color: var(--axis-year-color);
      font-size: var(--axis-year-size);
      font-weight: var(--axis-year-weight);
  }

  /* 3. Items */
  ::v-deep .vis-item {
      background-color: var(--item-bg-color);
      border-color: var(--item-border-color); /* Usually same as BG for flat look */
      color: var(--item-text-color);
      border-radius: var(--item-border-radius); /* Configurable Radius */
      border-radius: var(--item-border-radius); /* Configurable Radius */
      font-size: var(--global-font-size); /* Use Global Font Size */
      box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Subtle depth */
      box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Subtle depth */
      border-width: 1px;
      
      /* Flex layout for content */
      display: flex;
      align-items: center;
      padding: 0 8px;
      line-height: normal;

      &.vis-selected {
          border-color: #3b82f6; /* Blue ring selection */
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          z-index: 2;
      }
      
      /* Range items specifically */
      &.vis-range {
          border-width: 1px;
      }
  }
  /* FIX: Selector must attach class to .vis-label, not search inside it */
  ::v-deep .vis-labelset .vis-label {
      border-bottom: 1px solid #e2e8f0;
      display: flex; /* Ensure flex for alignment */
      align-items: center;
      padding-left: 12px;
  }

  /* Level 1 */
  ::v-deep .vis-label.group-level-1 {
      background-color: var(--group-lvl1-bg);
      color: var(--group-lvl1-color);
      font-size: var(--group-lvl1-size) !important;
      font-weight: var(--group-lvl1-weight) !important;
      z-index: 10;
  }
  
  /* Level 2 */
  ::v-deep .vis-label.group-level-2 {
      background-color: var(--group-lvl2-bg);
      color: var(--group-lvl2-color);
      font-size: var(--group-lvl2-size) !important;
      font-weight: var(--group-lvl2-weight) !important;
      padding-left: 24px; /* Indent */
  }

  /* Level 3 */
  ::v-deep .vis-label.group-level-3 {
      background-color: var(--group-lvl3-bg);
      color: var(--group-lvl3-color);
      font-size: var(--group-lvl3-size) !important;
      font-weight: var(--group-lvl3-weight) !important;
      padding-left: 36px; /* Indent */
  }

  /* 5. Current Time Marker */
  ::v-deep .vis-current-time {
      background-color: #ef4444; /* Red-500 */
      width: 2px;
      z-index: 1000;
      pointer-events: none;
  }

  /* 6. Tooltips */
  ::v-deep .vis-tooltip {
      z-index: 10000;
      background-color: white;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: var(--global-font-family);
      font-size: 12px;
      color: #334155;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}
</style>
