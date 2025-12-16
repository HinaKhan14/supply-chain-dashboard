import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddCommentIcon from '@mui/icons-material/AddComment';
import axios from "axios";

export default function TableComments({ rowId, existingComment, onSaved }) {
    const [open, setOpen] = React.useState(false);
    const [comment, setComment] = React.useState(existingComment || "");

    React.useEffect(() => {
        setComment(existingComment);
    }, [existingComment]);

    const handleSave = async () => {
        await axios.put("http://localhost:5000/api/update-comment", {
            id: rowId,
            comment
        });

        onSaved();    // refresh parent table
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button onClick={() => setOpen(true)}>
                <AddCommentIcon />
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Comment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Add Comment"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {/* Display existing saved comment */}
                    {existingComment && (
                        <div style={{
                            marginTop: "20px",
                            padding: "10px",
                            background: "#f5f5f5",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#333"
                        }}>
                            <strong>Saved Comment:</strong>
                            <br />
                            {existingComment}
                        </div>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
