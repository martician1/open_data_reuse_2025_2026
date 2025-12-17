import Popover from "@mui/material/Popover";
import "./BulgariaMap.css"
import { useState } from "react";
import demographicData from "./assets/bulgaria_demographic_data.json"
import provinceBorderData from "./assets/bulgaria_province_border_data.json"

const svgBorder = new Map(provinceBorderData as [string, string][])
const permanentResidents = new Map<string, number>();
const currentResidents = new Map<string, number>();

for (const row of demographicData) {
  const provinceName = row[0]
  if (!svgBorder.has(provinceName)) {
    console.error(`Invalid province name ${provinceName}`);
    continue;
  }
  permanentResidents.set(provinceName, (permanentResidents.get(provinceName) ?? 0) + Number(row[3]));
  currentResidents.set(provinceName, (currentResidents.get(provinceName) ?? 0) + Number(row[4]));
}

export function BulgariaMap() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 612.53589 396.54724"
    width={1200}
  >
    {Array.from(svgBorder.keys()).map((name) => <Province name={name} />)}
  </svg>
}

function Province({ name }: { name: string }) {
  const [anchorEl, setAnchorEl] = useState<SVGPathElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<SVGPathElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return <>
    <path
      d={svgBorder.get(name)}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    />
    <Popover
      id="mouse-over-popover"
      sx={{ pointerEvents: 'none' }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
      marginThreshold={0}
    >
      <div style={{ fontSize: 32, padding: 12, borderBottom: "6px solid darkgray" }}>
        <div style={{ textAlign: "center", fontWeight: "bold" }}> {name[0] + name.slice(1).toLowerCase()} </div>
        <div> Постоянен адрес: {permanentResidents.get(name)} </div>
        <div> Настоящ адрес: {currentResidents.get(name)} </div>
      </div>
    </Popover >
  </>

}
