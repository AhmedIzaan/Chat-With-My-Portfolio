"""Resume parsing service for PDF and DOCX files"""
import os
from typing import List
import fitz  # PyMuPDF
from docx import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.config import settings


def parse_resume(file_path: str) -> str:
    """
    Parse resume from PDF or DOCX file and extract text.
    
    Args:
        file_path: Path to the resume file
        
    Returns:
        Extracted text content from the resume
        
    Raises:
        FileNotFoundError: If file doesn't exist
        ValueError: If file format is not supported
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Resume file not found: {file_path}")
    
    # Determine file type by extension
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    
    if ext == ".pdf":
        return _parse_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return _parse_docx(file_path)
    else:
        raise ValueError(f"Unsupported file format: {ext}. Only PDF and DOCX are supported.")


def _parse_pdf(file_path: str) -> str:
    """Extract text from PDF using PyMuPDF"""
    try:
        doc = fitz.open(file_path)
        text_content = []
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            text_content.append(text)
        
        doc.close()
        
        # Join all pages with double newline
        full_text = "\n\n".join(text_content)
        return _clean_text(full_text)
    
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")


def _parse_docx(file_path: str) -> str:
    """Extract text from DOCX using python-docx"""
    try:
        doc = Document(file_path)
        text_content = []
        
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_content.append(paragraph.text)
        
        # Join all paragraphs with single newline
        full_text = "\n".join(text_content)
        return _clean_text(full_text)
    
    except Exception as e:
        raise ValueError(f"Failed to parse DOCX: {str(e)}")


def _clean_text(text: str) -> str:
    """Clean and normalize extracted text"""
    # Remove excessive whitespace while preserving structure
    lines = [line.strip() for line in text.split("\n")]
    # Remove empty lines but keep paragraph breaks (double newline)
    cleaned_lines = []
    prev_empty = False
    
    for line in lines:
        if line:
            cleaned_lines.append(line)
            prev_empty = False
        elif not prev_empty:
            # Keep one empty line for paragraph break
            cleaned_lines.append("")
            prev_empty = True
    
    return "\n".join(cleaned_lines).strip()


def chunk_text(text: str) -> List[str]:
    """
    Split text into chunks for embedding.
    
    Args:
        text: Full text content to split
        
    Returns:
        List of text chunks
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
        length_function=len,
    )
    
    chunks = text_splitter.split_text(text)
    return chunks
