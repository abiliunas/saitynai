import { Typography } from "@mui/material";

export default function HomePage() {
    return (
        <div>
            <Typography variant="h4">
                Šeimos finansų valdymo sistema
            </Typography>
            <hr/>
            <Typography variant="h5">
                Šeimos finansų valdymo sistema yra specialiai sukurtas įrankis, kuris padeda efektyviai valdyti namų ūkio finansus. Ši informacinė sistema suteikia galimybę stebėti ir valdyti įvairias finansines veiklos sritis, taip užtikrinant tvarkingą ir organizuotą namų ūkio finansų valdymą. 
            </Typography>
            <br/>
            <Typography variant="h6">
                Pagrindinės šeimos finansų valdymo sistemos funkcijos:
            </Typography>
            <Typography variant="h6">
                <ul>
                    <li>Galimybė matyti einamų išlaidų likučius</li>
                    <li>Vartotojų papildomų išlaidų/įplaukų įtraukimo galimybė</li>
                    <li>Pinigų krepšelio būsenos grafikas</li>
                </ul>
            </Typography>
            <br/>
            <Typography variant="subtitle1">
                Autorius: Adomas Biliūnas IFF-1/9
            </Typography>
        </div>
    );
}
