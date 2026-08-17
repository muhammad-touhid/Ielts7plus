// src/lib/pageBuilder/widgets/Grid.jsx
"use client";

import { GRID_DATA_SOURCE_OPTIONS, CARD_REGISTRY } from "../cards/registry";
import GridShell from "../carousel/GridShell";
import { useDataSourceItems } from "../carousel/useDataSourceItems";
import {
  cardStyleFieldSet,
  cardStyleDefaultProps,
  buildCardStyleVars,
} from "../fields/cardStyleField";
import { useThemeColors } from "../theme/ThemeColorsContext";

export const Grid = {
  label: "Grid",
  fields: {
    dataSource: {
      type: "select",
      label: "Show",
      options: GRID_DATA_SOURCE_OPTIONS,
    },
    limit: {
      type: "select",
      label: "Number of Items",
      options: [
        { label: "3", value: "3" },
        { label: "6", value: "6" },
        { label: "9", value: "9" },
        { label: "12", value: "12" },
      ],
    },
    columns: {
      type: "select",
      label: "Columns",
      options: [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
    },
    ...cardStyleFieldSet(),
  },
  defaultProps: {
    id: "grid-default",
    dataSource: "course",
    limit: "6",
    columns: "3",
    ...cardStyleDefaultProps(),
  },
  render: function GridRender({
    dataSource,
    limit,
    columns,
    cardBg,
    cardAccent,
    titleColor,
    titleSize,
    textColor,
    textSize,
    buttonSize,
    cardPadding,
  }) {
    const { themeColors } = useThemeColors();
    const { items, error } = useDataSourceItems(
      dataSource,
      parseInt(limit, 10),
      null,
    );
    const entry = CARD_REGISTRY[dataSource];
    const Card = entry?.Card;

    const cardVars = buildCardStyleVars(
      {
        cardBg,
        cardAccent,
        titleColor,
        titleSize,
        textColor,
        textSize,
        buttonSize,
        cardPadding,
      },
      themeColors,
    );

    if (error) {
      return (
        <div className="text-center py-10 text-sm text-slate-400">
          Couldn&apos;t load right now.
        </div>
      );
    }
    if (items === null) {
      return (
        <div className="text-center py-10 text-sm text-slate-400">
          Loading...
        </div>
      );
    }
    if (!Card) {
      return (
        <div className="text-center py-10 text-sm text-red-400">
          Unknown data source.
        </div>
      );
    }

    return (
      <div style={cardVars}>
        <GridShell
          items={items}
          renderCard={(item) => <Card item={item} />}
          getKey={entry.getKey}
          columns={parseInt(columns, 10)}
        />
      </div>
    );
  },
};
