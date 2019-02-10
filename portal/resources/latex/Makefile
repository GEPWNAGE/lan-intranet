all: pages.pdf

main.pdf:
# we run pdflatex twice, otherwise the background doesn't render correctly
	pdflatex main.tex
	pdflatex main.tex

pages.pdf: main.pdf
	pdflatex pages.tex

clean:
	rm -f main.{ps,pdf,log,aux,out,dvi,bbl,blg} pages.{ps,pdf,log,aux,out,dvi,bbl,blg}
