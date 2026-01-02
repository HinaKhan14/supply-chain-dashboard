import React, { useState, useMemo } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

export default function TableModal({ buttonName, data, id, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // ✅ handlers (FIXES ESLINT ERROR)
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };

    // ✅ sort materials
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) =>
            a.Material.localeCompare(b.Material)
        );
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/add-booth-data`,
                payload
            );

            if (onSuccess) onSuccess();
            handleClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                {buttonName || "Add Data"}
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Add Data</DialogTitle>

                <DialogContent>
                    <Autocomplete
                        options={sortedData}
                        getOptionLabel={(option) => option.Material}
                        onChange={(e, value) => setSelectedRow(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Material"
                                variant="standard"
                                margin="dense"
                            />
                        )}
                    />

                    {selectedRow && (
                        <>
                            <TextField
                                margin="dense"
                                label="Material Description"
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
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!selectedRow}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
