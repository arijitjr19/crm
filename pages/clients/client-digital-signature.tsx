import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { useMutation } from "@tanstack/react-query";
import { submitSignDocumentReview } from "@/api/functions/client.api";
import { queryClient } from "pages/_app";
import { toast } from "sonner";

interface SignDocumentSignatureProps {
    consentId: string;
    onClose: () => void;
  }

export default function SignaturePadComponent({
    consentId,
    onClose,
  }: SignDocumentSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const [isEmpty, setIsEmpty] = useState(true);
  const [decision, setDecision] = useState<boolean>(true);
  const [note, setNote] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Initialize signature pad
      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)", // white background
      });

      // Handle start and end events
      signaturePadRef.current.onBegin = () => setIsEmpty(false);
      signaturePadRef.current.onEnd = () => {
        console.log("Signature completed");
      };
    }

    // Cleanup on unmount
    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, []);

  // Clear signature pad
  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
  };

//   ------- Mutation Start Here -------
const mutation = useMutation({
    mutationFn: submitSignDocumentReview,
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({
              queryKey: ["sign_document_pending_client_refresh"]
            });
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
    },
  });

//   -------- Mutation End Here ---------

  // Save signature + log everything
  const saveSignature = () => {
    const dataURL = signaturePadRef.current?.toDataURL();

    if (!dataURL || isEmpty) {
      alert("Please provide a signature before submitting.");
      return;
    }

    mutation.mutate({
        consentId: consentId, // dynamic value
        approved: decision,
        rejectionNotes: note,
        signatureBase64: dataURL,
      });

    console.log("✅ Submitted Data:");
    console.log("Decision:", decision);
    console.log("Note:", note);
    console.log("Signature Data URL:", dataURL);
    onClose();
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* Decision Dropdown */}
      {/* <Typography variant="h6" sx={{ mb: 1 }}>
        Review Decision
      </Typography> */}
      
<Select
  value={decision}
  onChange={(e) => setDecision(e.target.value === "true")}
  fullWidth
  sx={{ maxWidth: 400, mb: 2 }}
>
  <MenuItem value="true">Accept</MenuItem>
  <MenuItem value="false">Reject</MenuItem>
</Select>

      {/* Note Textarea */}
      <TextField
        label="Write your note here..."
        multiline
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        fullWidth
        sx={{ maxWidth: 400, mb: 3 }}
      />

      {/* Signature Pad */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Signature
      </Typography>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      ></canvas>

      {/* Buttons */}
      <div style={{ marginTop: "10px" }}>
        <Button
          variant="outlined"
          color="warning"
          onClick={clearSignature}
          sx={{ mr: 2 }}
        >
          Clear
        </Button>
        <Button variant="contained" onClick={saveSignature}>
          Submit
        </Button>
      </div>
    </div>
  );
}
