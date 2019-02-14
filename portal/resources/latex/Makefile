all: pages.pdf

main.pdf: main.tex vouchers.tex
# we run pdflatex twice, otherwise the background doesn't render correctly
	pdflatex main.tex
	pdflatex main.tex

pages.pdf: main.pdf pages.tex
	pdflatex pages.tex

clean:
	rm -f *.{ps,pdf,log,aux,out,dvi,bbl,blg}
