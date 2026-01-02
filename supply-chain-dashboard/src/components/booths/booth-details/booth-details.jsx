import React, { useState, useEffect } from "react";
import "./booth-details.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TableModal from "../../table-modal/table-modal";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import TableComments from "../table-comments/table-comments";
import Papa from "papaparse";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export default function BoothDetails({ id, selectedDate }) {
    const [data, setData] = useState([]);
    const [boothData, setBoothData] = useState([]);
    const [switchStart, setSwitchStart] = useState({});
    const [switchEnd, setSwitchEnd] = useState({});
    const [tableState, setTableState] = useState({});
    const [activeStart, setActiveStart] = useState(null); // tracks which row has active start
    const [user, setUser] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState(null); // "start" | "end"
    const [selectedRowId, setSelectedRowId] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/sheet-data`)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetchBoothData();
    }, []);

    useEffect(() => {
        fetchBoothData();
    }, [selectedDate]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
    }, []);


    const handleDelete = async (rowId) => {
        if (!window.confirm("Are you sure you want to delete this row?")) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete-booth-row/${rowId}`);
            fetchBoothData(); // refresh table
        } catch (err) {
            console.error(err);
        }
    };
    const handleCSVUpload = (e) => {
        console.log("FILE INPUT TRIGGERED");
        const file = e.target.files[0];
        console.log(file);
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                try {
                    await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-booth-csv`, {
                        boothId: id,
                        rows: result.data
                    });

                    fetchBoothData(); // refresh table
                    alert("CSV uploaded successfully");
                } catch (err) {
                    console.error(err);
                    alert("CSV upload failed");
                }
            }
        });
    };

    const fetchBoothData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/get-booth-data/${id}`, {
            params: {
                date: selectedDate.toISOString().split("T")[0]
            }
        })
            .then((res) => {
                setBoothData(res.data);

                const startStates = {};
                const endStates = {};
                const table = {};

                res.data.forEach(row => {
                    startStates[row._id] = row.startTime !== "";
                    endStates[row._id] = row.endTime !== "";

                    table[row._id] = {
                        start: row.startTime || null,
                        end: row.endTime || null,
                        totalTime: row.TotalTime || null
                    };

                    if (row.startTime && !row.endTime) {
                        setActiveStart(row._id);
                    }
                });

                setSwitchStart(startStates);
                setSwitchEnd(endStates);
                setTableState(table);
            })
            .catch((err) => console.error(err));
    };

    // const handleStartSwitch = async (no) => {
    //     const now = new Date();
    //     const start = now.toLocaleTimeString([], {
    //         hour: "2-digit",
    //         minute: "2-digit"
    //     });

    //     setSwitchStart(prev => ({ ...prev, [no]: true }));
    //     setTableState(prev => ({
    //         ...prev,
    //         [no]: { ...prev[no], start }
    //     }));

    //     setActiveStart(no);

    //     await axios.put(`${process.env.REACT_APP_API_URL}/api/update-start-time`, {
    //         no,
    //         startTime: start
    //     });

    //     fetchBoothData();
    // };
    const handleStartSwitch = (no, value) => {
        if (value) {
            setConfirmType("start");
            setSelectedRowId(no);
            setConfirmOpen(true);
        }
    };


    // const handleEndSwitch = async (no, value) => {
    //     if (value) {
    //         const now = new Date();
    //         const end = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    //         const start = tableState[no].start;
    //         let total = null;
    //         if (start) {
    //             const s = new Date(`2000-01-01 ${start}`);
    //             const e = new Date(`2000-01-01 ${end}`);
    //             total = Math.round((e - s) / 60000);
    //         }

    //         setSwitchEnd(prev => ({ ...prev, [no]: true }));
    //         setTableState(prev => ({
    //             ...prev,
    //             [no]: { ...prev[no], end, totalTime: total }
    //         }));

    //         // Clear activeStart only if this row was the active one
    //         if (activeStart === no) setActiveStart(null);

    //         await axios.put(`${process.env.REACT_APP_API_URL}/api/update-end-time`, {
    //             no,
    //             endTime: end,
    //             totalTime: total
    //         });

    //     } else {
    //         // User unchecked end switch → do NOT enable all start buttons
    //         setSwitchEnd(prev => ({ ...prev, [no]: false }));
    //         setTableState(prev => ({
    //             ...prev,
    //             [no]: { ...prev[no], end: null, totalTime: null }
    //         }));

    //         await axios.put(`${process.env.REACT_APP_API_URL}/api/update-end-time`, {
    //             no,
    //             endTime: "",
    //             totalTime: ""
    //         });
    //     }

    //     fetchBoothData();
    // };
    const handleEndSwitch = (no, value) => {
        if (value) {
            setConfirmType("end");
            setSelectedRowId(no);
            setConfirmOpen(true);
        }
    };
    const handleConfirmYes = async () => {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        if (confirmType === "start") {
            setSwitchStart(prev => ({ ...prev, [selectedRowId]: true }));
            setTableState(prev => ({
                ...prev,
                [selectedRowId]: { ...prev[selectedRowId], start: time }
            }));

            setActiveStart(selectedRowId);

            await axios.put(`${process.env.REACT_APP_API_URL}/api/update-start-time`, {
                no: selectedRowId,
                startTime: time
            });
        }

        if (confirmType === "end") {
            const start = tableState[selectedRowId]?.start;
            let total = null;

            if (start) {
                const s = new Date(`2000-01-01 ${start}`);
                const e = new Date(`2000-01-01 ${time}`);
                total = Math.round((e - s) / 60000);
            }

            setSwitchEnd(prev => ({ ...prev, [selectedRowId]: true }));
            setTableState(prev => ({
                ...prev,
                [selectedRowId]: {
                    ...prev[selectedRowId],
                    end: time,
                    totalTime: total
                }
            }));

            await axios.put(`${process.env.REACT_APP_API_URL}/api/update-end-time`, {
                no: selectedRowId,
                endTime: time,
                totalTime: total
            });
        }

        setConfirmOpen(false);
        setSelectedRowId(null);
        setConfirmType(null);
        fetchBoothData();
    };

    const hoursToMinutes = (hrs) => {
        if (!hrs) return 0;
        return Math.round(parseFloat(hrs) * 60);
    };

    const getDifference = (row) => {
        if (!row.endTime || !row.TotalTime) return null;

        const totalHrsMinutes = hoursToMinutes(row.totalHrs);
        const actualMinutes = row.TotalTime;

        return totalHrsMinutes - actualMinutes;
    };


    return (
        <TableContainer component={Paper} className="table-scroll">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell>Material</StyledTableCell>
                        <StyledTableCell>Material Description</StyledTableCell>
                        <StyledTableCell>S.H</StyledTableCell>
                        <StyledTableCell>P.H</StyledTableCell>
                        <StyledTableCell>T.H</StyledTableCell>
                        <StyledTableCell>Start</StyledTableCell>
                        <StyledTableCell>End</StyledTableCell>
                        <StyledTableCell>Actual Time</StyledTableCell>
                        <StyledTableCell>T.H - A.T</StyledTableCell>
                        <StyledTableCell> </StyledTableCell>
                        <StyledTableCell> </StyledTableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {boothData.map((row, index) => (
                        <StyledTableRow key={row._id}>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>{row.material}</StyledTableCell>
                            <StyledTableCell>{row.materialDescription}</StyledTableCell>
                            <StyledTableCell>{row.setupHrs}</StyledTableCell>
                            <StyledTableCell>{row.processHrs}</StyledTableCell>
                            <StyledTableCell>
                                {hoursToMinutes(row.totalHrs)} mins
                            </StyledTableCell>


                            <StyledTableCell>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={!!switchStart[row._id]}
                                                onChange={(e) => handleStartSwitch(row._id, e.target.checked)}
                                                disabled={
                                                    user?.name === "admin" ||
                                                    !!switchStart[row._id] ||     // 🔒 cannot turn OFF
                                                    !!switchEnd[row._id]
                                                }
                                            />

                                        }
                                        label={tableState[row._id]?.start || ""}
                                    />
                                </FormGroup>
                            </StyledTableCell>

                            <StyledTableCell>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={!!switchEnd[row._id]}
                                                onChange={(e) => handleEndSwitch(row._id, e.target.checked)}
                                                disabled={
                                                    user?.name === "admin" ||
                                                    !!switchEnd[row._id] ||      // 🔒 cannot turn OFF
                                                    !switchStart[row._id]
                                                }
                                            />

                                        }
                                        label={tableState[row._id]?.end || ""}
                                    />
                                </FormGroup>
                            </StyledTableCell>

                            <StyledTableCell>
                                {tableState[row._id]?.totalTime
                                    ? `${tableState[row._id].totalTime} mins`
                                    : ""}
                            </StyledTableCell>
                            <StyledTableCell>
                                {(() => {
                                    const diff = getDifference(row);
                                    if (diff === null) return "";

                                    return (
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                color: diff < 0 ? "red" : "green"
                                            }}
                                        >
                                            {diff} mins
                                        </span>
                                    );
                                })()}
                            </StyledTableCell>

                            <StyledTableCell>
                                <StyledTableCell>
                                    {user?.name === "admin" ? (
                                        <DeleteIcon
                                            onClick={() => handleDelete(row._id)}
                                            style={{ cursor: "pointer", color: "red" }}
                                        />
                                    ) : (
                                        <DeleteIcon
                                            style={{ cursor: "not-allowed", color: "#ccc" }}
                                        />
                                    )}
                                </StyledTableCell>

                            </StyledTableCell>
                            <StyledTableCell>
                                <TableComments
                                    rowId={row._id}
                                    existingComment={row.comment}
                                    onSaved={fetchBoothData}
                                />
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>

                <TableBody>
                    <StyledTableRow>
                        <StyledTableCell colSpan={12} align="center">
                            <div style={{ margin: "15px auto" }}>
                                {user?.name === "admin" && (
                                    <>
                                        <TableModal
                                            buttonName="Add Data"
                                            data={data}
                                            id={id}
                                            onSuccess={fetchBoothData}
                                        />

                                        <br /><br />

                                        <input
                                            type="file"
                                            accept=".csv"
                                            id="csvUpload"
                                            style={{ display: "none" }}
                                            onChange={handleCSVUpload}
                                        />

                                        <button
                                            className="csv-btn"
                                            onClick={() => document.getElementById("csvUpload").click()}
                                        >
                                            Upload CSV
                                        </button>
                                    </>
                                )}



                            </div>
                        </StyledTableCell>
                    </StyledTableRow>
                </TableBody>
            </Table>
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirmation</DialogTitle>

                <DialogContent>
                    Are you sure you want to
                    <strong>
                        {confirmType === "start" ? " START " : " END "}
                    </strong>
                    this process?
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>No</Button>
                    <Button variant="contained" onClick={handleConfirmYes}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


        </TableContainer>
    );
}
