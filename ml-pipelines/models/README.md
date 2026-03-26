# Model Artifacts

This directory is designated for storing production-ready, compiled weights of the Graph Neural Network.
The `inference-service` mounts this directory to load the active model into GPU memory via ONNX Runtime or LibTorch.

## Current Versions
- `gnn_sage_v2_3_base.onnx` (Deprecated)
- `gnn_sage_v2_4.onnx` (Active Production Model)
