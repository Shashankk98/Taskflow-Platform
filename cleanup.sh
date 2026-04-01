#!/bin/bash

echo "🧹 Cleaning up TaskFlow Platform..."

helm uninstall task-manager

echo "✅ Cleanup Complete!"