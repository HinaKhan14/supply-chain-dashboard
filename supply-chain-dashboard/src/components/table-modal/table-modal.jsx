import * as React from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import axios from "axios";

export default function TableModal({ buttonName, data, id, onSuccess }) {
    const [open, setOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelectChange = (event) => {
        const code = event.target.value;
        const row = data.find((item) => item.Material === code);
        setSelectedRow(row || null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedRow) return;

        const payload = {
            boothNo: id,
            material: selectedRow.Material,
            materialDescription: selectedRow["Material Description"],
            setupHrs: selectedRow["Setup Hrs"],
            processHrs: selectedRow["Process Hrs"],
            totalHrs: selectedRow["Total Hrs"],
            startTime: "",
            endTime: "",
            TotalTime: ""
        };

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/add-booth-data`, payload);
            console.log("Saved!", res.data);

            // 🔥 REFRESH booth table from parent
            if (onSuccess) onSuccess();

            handleClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                {buttonName || "Open Modal"}
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Add Data</DialogTitle>

                <DialogContent>
                    <FormControl fullWidth margin="dense" variant="standard">
                        <InputLabel>Select Material</InputLabel>
                        <Select
                            value={selectedRow ? selectedRow.Material : ""}
                            onChange={handleSelectChange}
                        >
                            {data.map((row) => (
                                <MenuItem key={row.Material} value={row.Material}>
                                    {row.Material}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedRow && (
                        <>
                            <TextField
                                margin="dense"
                                label="Material Name"
                                fullWidth
                                variant="standard"
                                value={selectedRow["Material Description"]}
                                disabled
                            />

                            <TextField
                                margin="dense"
                                label="Setup Hrs"
                                fullWidth
                                variant="standard"
                                value={selectedRow["Setup Hrs"]}
                                disabled
                            />

                            <TextField
                                margin="dense"
                                label="Process Hrs"
                                fullWidth
                                variant="standard"
                                value={selectedRow["Process Hrs"]}
                                disabled
                            />

                            <TextField
                                margin="dense"
                                label="Total Hrs"
                                fullWidth
                                variant="standard"
                                value={selectedRow["Total Hrs"]}
                                disabled
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
