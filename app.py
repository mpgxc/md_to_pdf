from flask import Flask, request, jsonify
import markdown
import pdfkit
import os

app = Flask(__name__)


def markdown_to_pdf(markdown_content, output_pdf_file):
    html_content = markdown.markdown(markdown_content)

    options = {
            "encoding": "UTF-8",
            "page-size": "A4",
            "margin-top": "1in",
            "margin-right": "1in",
            "margin-bottom": "1in",
            "margin-left": "1in",
    }
    
    pdfkit.from_string(
        html_content,
        output_pdf_file,
        options
    )

    return output_pdf_file


@app.route("/convert", methods=["POST"])
def convert_markdown_to_pdf():
    try:
        if request.content_type != "text/markdown":
            return (
                jsonify(
                    {"error": "Tipo de conteúdo não suportado. Use 'text/markdown'."}
                ),
                400,
            )

        markdown_content = request.data.decode("utf-8")

        if not markdown_content:
            return jsonify({"error": "Conteúdo Markdown não fornecido."}), 400

        output_pdf_file = "output.pdf"

        markdown_to_pdf(markdown_content, output_pdf_file)

        with open(output_pdf_file, "rb") as pdf_file:
            pdf_data = pdf_file.read()

        os.remove(output_pdf_file)

        return (
            pdf_data,
            200,
            {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="output.pdf"',
            },
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
