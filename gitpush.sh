:: Get date in 'yyyyMMdd_HHmm' format to use with file name.
FOR /f "usebackq" %%i IN (`PowerShell ^(Get-Date^).ToString^('yyyyMMdd'^)`) DO SET DTime=%%i

git add .
git commit -m"%DTime%"
git push

pause 