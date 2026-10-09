@echo off
setlocal enabledelayedexpansion

rem ==================== 配置排除项 ====================
rem 需要排除的目录名（出现在文件路径中即排除）
set EXCLUDE_DIRS=node_modules dist .git build coverage __pycache__

rem 需要排除的扩展名（小写，前后加空格用于精确匹配）
set EXCLUDE_EXTS= .png .jpg .jpeg .gif .svg .ico .webp .bmp .tiff .mp4 .webm .mov .avi .flv .mp3 .wav .ogg .flac .woff .woff2 .ttf .eot .otf .pdf .zip .tar .gz .rar .7z .exe .dll .so .dylib .map .lock .log

rem ==================== 初始化 ====================
set TOTAL_LINES=0
set FILE_COUNT=0

echo 正在统计当前文件夹（含子文件夹）内所有文本文件行数...
echo 已自动排除：%EXCLUDE_DIRS% 等目录，以及图片、字体、音视频等资源文件
echo.

rem 遍历所有文件（递归，不包括目录）
for /f "delims=" %%F in ('dir /s /b /a-d 2^>nul') do (
    set "FILE=%%F"
    set "SKIP="

    rem ----- 检查是否在排除目录中 -----
    for %%D in (%EXCLUDE_DIRS%) do (
        echo !FILE! | findstr /i /c:"\%%D\" >nul
        if not errorlevel 1 set SKIP=1
    )

    rem ----- 检查扩展名是否被排除 -----
    if not defined SKIP (
        set "EXT=%%~xF"
        if defined EXT (
            set "EXT_LC=!EXT!" & call :toLower
            echo !EXCLUDE_EXTS! | findstr /i /c:" !EXT_LC! " >nul
            if not errorlevel 1 set SKIP=1
        )
    )

    rem ----- 统计行数（如果没有被排除）-----
    if not defined SKIP (
        set /a FILE_COUNT+=1
        set "LINES=0"
        for /f %%a in ('type "%%F" 2^>nul ^| find /c /v "" 2^>nul') do set LINES=%%a
        set /a TOTAL_LINES+=!LINES!
        rem 可选：打印每个文件的行数（文件多时可注释下一行）
        echo [!FILE_COUNT!] !FILE! : !LINES! 行
    )
)

echo.
echo ========================================
echo 统计完成！
echo 有效文件数: %FILE_COUNT%
echo 总行数: %TOTAL_LINES%
echo ========================================
pause
goto :eof

rem ==================== 子程序：扩展名转小写 ====================
:toLower
set "EXT_LC=%EXT_LC%"
for %%a in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do set "EXT_LC=!EXT_LC:%%a=%%a!"
goto :eof